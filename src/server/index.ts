// modules
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import https from 'https'
import fs from 'fs'
import { exit } from "process";

// SWAGGER DOCS
import { runSwaggerDocs } from "../modules/swaggerDocs";

// CORE
import { Cache } from "../ker/core/cache";
import { routerGetByMetadataLabel } from "../api/core/router";
import { setCors } from "./cors";
import { envGetCert } from "../ker/core/env";
// - types
import { IRouterCache } from "../api/models/router/types";

// SERVER (MIDDLEWARE)
import { middlewareProxyRequestStatus } from "./middleware/middlewareProxyRequestStatus";
import { middlewareNewResponse } from "./middleware/middlewareNewResponse";
import { middlewareCORS } from "./middleware/middlewareCORS";
import { middlewareParams } from "./middleware/middlewareParams";
import { middlewareControllers } from "./middleware/middlewareControllers";
import { middlewareReleaseResponse } from "./middleware/middlewareReleaseResponse";
import { middlewareAppAuthorization } from "./middleware/middlewareAppAuthorization";
import { middlewareAuthSecureServer } from "./middleware/middlewareAuthSecureServer";
import { middlewareCheckRouteController } from "./middleware/middlewareCheckRouteController";
import { middlewareSession } from "./middleware/middlewareSession";

// - error handler
import { errorHandler } from "./middleware/errorHandler";
import { ApiError } from "../ker/core/error";

// UTILS
import { ApiCommandConsole } from "../ker/utils/console";
import { middlewareSessionResponse } from "./middleware/middlewareSessionResponse";

/**
 * Creates and starts a new Express server.
 */
export const runServer = (): void => {
    // Create an Express app
    const app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(compression());

    // Defines the Env for production environments
    const isProductionEnv: boolean = Cache._env.isProduction === false ? false : true;

    const mode: string = Cache._env.mode;

    // Load documentation if available
    // SwaggerDocs requires a default app with the expected origin of the server
    if (Cache._vars.documentation.isActive) {
        const swaggerDocsRoute = Cache._vars.documentation.swaggerDocsRoute
        runSwaggerDocs(app, swaggerDocsRoute as string)
    }

    // // Determine the server port based on the environment
    const serverPort: number = isProductionEnv ?
        Cache._env.connection.portDefault || 80 :
        Cache._env.connection.portAlternative || 80;

    app.set("sPort", serverPort);
    app.set("sHost", !Cache._env.connection.hostName ? '' : Cache._env.connection.hostName);

    // Start the server
    if (Cache._env.connection.usingSSL && Cache._env.connection.ssl) {
        let creds: {
            key: string | undefined,
            certificate: string | undefined,
            ca: string | undefined,
        } = {
            key: undefined,
            certificate: undefined,
            ca: undefined,
        }

        try {
            creds = {
                key: envGetCert(Cache._env.connection.ssl.privateKey),
                certificate: envGetCert(Cache._env.connection.ssl.certificate),
                ca: Cache._env.connection.ssl.ca ? envGetCert(Cache._env.connection.ssl.ca) : undefined,
            }
        } catch (ex) {
            ApiCommandConsole.showConsoleMessage('Error loading SSL/TLS certs');
            ApiCommandConsole.showConsoleMessage((ex as ApiError).getErrorSummary())
            exit()
        }

        const httpsServer = https.createServer(creds, app);

        // Escucha en un puerto seguro (por lo general, el puerto 443)
        httpsServer.listen(443, app.get("sHost"), () => {
            console.log(`apiKer (SSL) is running in ${mode} mode at http://${app.get("sHost") !== '' ? app.get("sHost") : 'localhost'}:${app.get("sPort")}`);
        });
    } else {
        app.listen(app.get("sPort"), app.get("sHost"), () => {
            console.log(`apiKer is running in ${mode} mode at http://${app.get("sHost") !== '' ? app.get("sHost") : 'localhost'}:${app.get("sPort")}`);
        });
    }

    // Check if required headers should be discarded for requests from the proxy server.
    if (Cache._vars.security.proxy.usingProxy) {
        app.use(middlewareProxyRequestStatus);
    }

    // Initialize a new response ready to be processed by the rest of the middleware.
    // Filters non-traceable requests: 404
    app.use(middlewareNewResponse);

    // Authentication server for KerLocker (klk)
    if (Cache._vars.security.authProtocol === 'kerLocker') {
        // Set CORS configuration
        app.use(setCors());

        // Get the KerLocker authentication route
        const klkAuthRoute = routerGetByMetadataLabel('AuthServer') as IRouterCache;

        // Apply KerLocker secure authentication middleware
        app.use(klkAuthRoute.route, middlewareAuthSecureServer);
    }

    // Apply middleware to check the route controller.
    app.use(middlewareCheckRouteController);

    // Apply CORS middleware.
    app.use(middlewareCORS);

    // If the authentication protocol is 'kerLocker', apply the application authorization middleware.
    if (Cache._vars.security.authProtocol === 'kerLocker') {
        app.use(middlewareAppAuthorization);
    }

    // Apply session middleware.
    app.use(middlewareSession);

    // Apply middleware for request parameters.
    app.use(middlewareParams);

    // Apply middleware for controllers.
    app.use(middlewareControllers);

    app.use(middlewareSessionResponse);
    
    // Apply error handler.
    app.use(errorHandler);

    // Apply response release middleware.
    app.use(middlewareReleaseResponse);

};
