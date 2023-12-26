// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../api/core/response";
import { appGetByID } from "../../api/core/apps";
// - types
import { IRouterCache } from "../../api/models/router/types";

// CORE
import { Cache } from "../../ker/core/cache";
import { MasterDatabase } from "../../ker/core/databases/master";
// - types

// ERROR
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { IApiError } from "../../ker/models/error/types";
import { ApiError } from "../../ker/core/error";

// UTILS
import { ApiCommandConsole } from "../../ker/utils/console";

// AUTH
import { IKerLockerTempAuth } from "../../api/models/auth/types";
import { KerLockerAuthModel } from "../../api/models/auth/model";
import { ApiSession } from "../../api/core/session";
import { ApiTimer } from "../../ker/utils/timer";

/**
 * Middleware to manage application authorization.
 * Verifies public authentication (public API auth token) and handles application authorization.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The function that calls the next middleware in the chain.
 */
export const middlewareAppAuthorization = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let router = newResponse.router;

    let route = router.route as IRouterCache;
    let CORS = route.CORS;

    // Check if CORS-managed authentication is required by ker
    if (newResponse.router.requireAuth) {

        const apiTokenName = Cache._vars.security.kerLockerPublicAuthHeaderName as string;

        // Check if the public API auth header is present in the request
        if (!newResponse.params.header[apiTokenName]) {
            return throwMiddlewareErr('ERR_PUBLIC_API_AUTH_TOKEN_HEADER_MISSING', ``, res, next);
        }

        let authToken: IKerLockerTempAuth | undefined;
        let origin = newResponse.params.header['origin'];

        try {
            // Find the authentication token in the database
            authToken = await MasterDatabase.findDocument(KerLockerAuthModel, 1, { token: newResponse.params.header[apiTokenName] });
        } catch (exception) {
            const myError: IApiError = {
                name: 'ERR_LOCATING_AUTH_TOKEN',
                exception: exception,
            };

            ApiCommandConsole.showConsoleMessage(new ApiError(myError).getErrorSummary(), 3);
        }

        // Check if the authentication token exists and if the origin matches
        if (!authToken || (origin && authToken && origin !== Cache._env.connection.serverDomain && origin !== authToken.origin)) {
            return throwMiddlewareErr('ERR_BAD_PUBLIC_API_AUTH_TOKEN', ``, res, next);
        }

        newResponse.app = appGetByID(authToken.appID);

        // Check if the token has expired
        const limitDate = new Date(authToken.date.getTime() + authToken.timeoutMins * 60000);
        const now = new ApiTimer()

        if (now.getDateObject() > limitDate) {
            return throwMiddlewareErr('ERR_EXPIRED_PUBLIC_API_AUTH_TOKEN', ``, res, next);
        }

        newResponse.session = new ApiSession(req ,res);
    }

    return next();
});
