// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../api/core/response";
import { appGetByOrigin } from "../../api/core/apps";
import { ApiSession } from "../../api/core/session";
// - types
import { IRouterCache } from "../../api/models/router/types";

// CORE
import { throwMiddlewareErr } from "../error/connectors/middlewareError";

// UTILS
import { Cache } from "../../ker/core/cache";
import { IApps } from "../../api/models/apps/types";
import { gSix } from "../../modules/gSix";
import { ApiError } from "../../ker/core/error";

export const middlewareSession = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let router = newResponse.router

    let route = router.route as IRouterCache;

    // CORS managed by ker
    if (newResponse.router.requireSession) {

        const sessionTokenName = Cache._vars.security.kerLockerSessionHeaderName

        if (!newResponse.params.cookie[sessionTokenName] && !newResponse.params.header[sessionTokenName]) {
            return throwMiddlewareErr('ERR_SESSION_TOKEN_NOT_FOUND', ``, res, next)
        }

        // new session creation
        if(!newResponse.session){
            newResponse.session = new ApiSession(
                req, res
            )
        }

        // the session gets auth at this point
        newResponse.app = appGetByOrigin(newResponse.router.origin) as IApps

        try {
            // Retrieving sessionData by inspecting the sessionToken
            await newResponse.session?.authorizeSessionToken()
            newResponse.sessionAlive = true
        } catch (ex) {
            const exError = (ex as ApiError).getErrorSummary()
            return throwMiddlewareErr(exError.name, ``, res, next, exError.exception)
        }

        const sessionTokenData = newResponse.session.tokenInfo

        const inputReadSession = {
            alias: 'session',
            query: 'lookUpByUserID',
            criteria: {
                userID: sessionTokenData.userID
            },
        }

        let session: any
        try {
            // Checking the status session and metadata
            session = await new gSix().readRecord(inputReadSession.alias, inputReadSession.query, inputReadSession.criteria, 1)
        } catch (ex) {
            const exError = (ex as ApiError).getErrorSummary()
            return throwMiddlewareErr(exError.name, ``, res, next, exError.exception)
        }

        // checks session times
        const sessionPermissionLevel = session.permissionLevel
        const targetPermision = newResponse.router.controller?.minPermissionLevel ?
            newResponse.router.controller?.minPermissionLevel : newResponse.router.route?.minPermissionLevel || 3

         if (targetPermision > sessionPermissionLevel) {
            return throwMiddlewareErr('ERR_LOW_PERMISSION_LEVEL', ``, res, next)
        }

        if (newResponse.router.route?.CSRF || newResponse.router.controller?.CSRF) {
            const targetCSRF = sessionTokenData.CSRF

            const CSRFHeaderName = Cache._vars.security.kerLockerCSRFHeaderName
            if (targetCSRF !== newResponse.params.header[CSRFHeaderName]) {

                // CSRF Failure
                return throwMiddlewareErr('ERR_CSRF_DOES_NOT_MATCH', ``, res, next)
            }
        }
    }

    newResponse.securityCheckAuthToken = true

    return next();
})