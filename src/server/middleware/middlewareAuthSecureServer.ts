// MODULES
import { NextFunction, Request, Response } from "express";
import cors from 'cors'
import ipRangeCheck from 'ip-range-check'
// API
import { ApiResponse } from "../../api/core/response";
import { appGetAppsAllowedOrigins, appGetByRequest, appGetBySecretToken } from "../../api/core/apps";
// - types
import { IRouterCache, IRouterController, IRouterControllersAllowed } from "../../api/models/router/types";

// CORE
import { Cache } from "../../ker/core/cache";
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { IAppsCache } from "../../api/models/apps/types";
import { Randomizer } from "../../ker/utils/randomizer";
import { ApiTimer } from "../../ker/utils/timer";
import { routerGetByMetadataLabel } from "../../api/core/router";
import { MasterDatabase } from "../../ker/core/databases/master";
import { IApiError } from "../../ker/models/error/types";
import { ApiCommandConsole } from "../../ker/utils/console";
import { ApiError } from "../../ker/core/error";
import { KerLockerAuthModel } from "../../api/models/auth/model";
import { IKerLockerTempAuth } from "../../api/models/auth/types";

export const middlewareAuthSecureServer = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;

    newResponse.isKLKAuthRequest = true
    newResponse.requestType = 'auth'

    const secretAppToken = req.headers[Cache._vars.security.kerLockerSecretAuthHeaderName as string]
    if (!secretAppToken) {
        // error
        return throwMiddlewareErr('ERR_SECRET_API_TOKEN_HEADER_MISSING', ``, res, next)

    }

    const targetApp = appGetBySecretToken(secretAppToken as string)

    if (!targetApp) {
        // error
        return throwMiddlewareErr('BAD_SECRET_TOKEN', ``, res, next)
    }

    newResponse.app = targetApp

    const publicToken = Randomizer.RandomString(64)
    const tmpAuth: IKerLockerTempAuth = {
        token: publicToken,
        date: new ApiTimer().getDateObject(),
        appID: targetApp.metadata?.appID as string,
        timeoutMins: 10,
        origin: targetApp.allowedOrigin as string
    }

    try {
        await MasterDatabase.createDocument(KerLockerAuthModel, tmpAuth)
    } catch (exception) {
        const myError: IApiError = {
            name: 'ERR_CREATING_NEW_AUTH_RESPONSE',
            exception: exception,
        };

        ApiCommandConsole.showConsoleMessage(new ApiError(myError).getErrorSummary(), 3)
    }

    newResponse.auth = tmpAuth

    newResponse.sendAuth()

    try{
        await newResponse.track()
    }catch(exception){
        ApiCommandConsole.showConsoleMessage('Error during tracking a request',3)
    }
})