// MODULES
import { NextFunction, Request, Response } from "express";
import cors from 'cors'
import ipRangeCheck from 'ip-range-check'
// API
import { ApiResponse } from "../../api/core/response";
import { appGetAppsAllowedOrigins, appGetByID, appGetByOrigin, appGetByRequest } from "../../api/core/apps";
// - types
import { IRouterCache, IRouterController, IRouterControllersAllowed } from "../../api/models/router/types";

// CORE
import { Cache } from "../../ker/core/cache";
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { IAppsCache } from "../../api/models/apps/types";
import { MasterDatabase } from "../../ker/core/databases/master";
import { KerLockerAuthModel } from "../../api/models/auth/model";
import { IApiError } from "../../ker/models/error/types";
import { ApiCommandConsole } from "../../ker/utils/console";
import { ApiError } from "../../ker/core/error";
import { IKerLockerTempAuth } from "../../api/models/auth/types";

export const middlewareAppAuthorization = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let router = newResponse.router

    let route = router.route as IRouterCache;
    let CORS = route.CORS

    // CORS managed by ker
    if (newResponse.router.requireAuth) {

        const apiTokenName = Cache._vars.security.kerLockerPublicAuthHeaderName as string

        if (!newResponse.params.header[apiTokenName]) {
            return throwMiddlewareErr('ERR_NO_API_TOKEN_FOUND', ``, res, next)
        }

        let AuthToken: IKerLockerTempAuth | undefined
        let origin = newResponse.params.header['origin']
        try {
            AuthToken =   await MasterDatabase.findDocument(KerLockerAuthModel, 1, { token: newResponse.params.header[apiTokenName] })
        } catch (exception) {
            const myError: IApiError = {
                name: 'ERR_RETRIEVING_AUTH',
                exception: exception,
            };

            ApiCommandConsole.showConsoleMessage(new ApiError(myError).getErrorSummary(), 3)
        }

        if (!AuthToken || (origin && AuthToken && origin !== Cache._env.connection.serverDomain && origin !== AuthToken.origin)) {
            return throwMiddlewareErr('ERR_BAD_API_TOKEN', ``, res, next)
        }

        newResponse.app = appGetByID(AuthToken.appID)

        //checking token expiration
        const limitDate = new Date(AuthToken.date.getTime() + AuthToken.timeoutMins * 60000)
        const now = new Date();

        if(now > limitDate ){
            return throwMiddlewareErr('ERR_EXPIRED_API_TOKEN', ``, res, next)
        }
    }

    return next();
})