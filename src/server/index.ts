// modules
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import https from 'https'
import fs from 'fs'

// SWAGGER DOCS
import { runSwaggerDocs } from "../modules/swaggerDocs";

// CORE
import { Cache } from "../ker/core/cache";

// SERVER (MIDDLEWARE)
import { middlewareProxyRequestStatus } from "./middleware/middlewareProxyRequestStatus";
import { middlewareNewResponse } from "./middleware/middlewareNewResponse";
import { middlewareCORS } from "./middleware/middlewareCORS";
import { middlewareFilterList } from "./middleware/middlewareFilterList";
import { middlewareDefaults } from "./middleware/middlewareDefaults";
import { middlewareParams } from "./middleware/middlewareParams";
import { middlewareControllers } from "./middleware/middlewareControllers";
// import { middlewareAuth } from "./middleware/middlewareAuth";
import { middlewareReleaseResponse } from "./middleware/middlewareReleaseResponse";

// - error handler
import { errorHandler } from "./middleware/errorHandler";
import { middlewareAppAuthorization } from "./middleware/middlewareAppAuthorization";
import { appGetAppsAllowedOrigins } from "../api/core/apps";
import { kerLockerSecurityServer } from "./auth";
import { middlewareAuthSecureServer } from "./middleware/middlewareAuthSecureServer";
import { middlewareCheckRouteController } from "./middleware/middlewareCheckRouteController";
import { routerGetByMetadataLabel } from "../api/core/router";
import { IRouterCache } from "../api/models/router/types";
import { middlewareSession } from "./middleware/middlewareSession";
import { setCors } from "./cors";


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
    if (Cache._env.connection.ssl) {
        const creds = {
            key: fs.readFileSync('ruta-al-archivo-privado.key', 'utf8'),
            certificate: fs.readFileSync('ruta-al-certificado.crt', 'utf8'),
            ca: fs.readFileSync('ruta-al-certificado-de-autoridad-ca.crt', 'utf8'),

        }
        const httpsServer = https.createServer(creds, app);

        // Escucha en un puerto seguro (por lo general, el puerto 443)
        httpsServer.listen(443, app.get("sHost"), () => {
            console.log('Servidor Express seguro en ejecución en el puerto 443');
        });
    } else {
        app.listen(app.get("sPort"), app.get("sHost"), () => {
            console.log(`apiKer is running in ${mode} mode at http://${app.get("sHost") !== '' ? app.get("sHost") : 'localhost'}:${app.get("sPort")}`);
        });
    }


    // checks the proxy server required headers discard requests from outside
    if (Cache._vars.security.proxy.usingProxy) {
        app.use(middlewareProxyRequestStatus);
    }

    // intializes a new response ready to get processed by the rest of the middleware.
    // filters the non-taceable requests: 404
    app.use(middlewareNewResponse);

    // auth server for klk
    if (Cache._vars.security.authProtocol === 'kerLocker') {
        app.use(setCors())
        const klkAuthRoute = routerGetByMetadataLabel('AuthServer') as IRouterCache
        app.use(klkAuthRoute.route, middlewareAuthSecureServer);
    }

    app.use(middlewareCheckRouteController);

    app.use(middlewareCORS);

    // app.use(middlewareFilterList);

    if (Cache._vars.security.authProtocol === 'kerLocker') {
        app.use(middlewareAppAuthorization);
    }

    app.use(middlewareSession);

    app.use(middlewareParams);

    app.use(middlewareControllers);

    app.use(errorHandler);   
    app.use(middlewareReleaseResponse);
};
