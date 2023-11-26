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
import { verifyToken } from "../../ker/utils/tokenizer";
import { Cache } from "../../ker/core/cache";

export const middlewareSession = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let router = newResponse.router

    let route = router.route as IRouterCache;

    // CORS managed by ker
    if (newResponse.router.requireSession) {
        newResponse.app = appGetByOrigin(newResponse.router.origin)

        if (!newResponse.app) {
            return throwMiddlewareErr('ERR_EXPIRED_PUBLIC_API_AUTH_TOKEN', ``, res, next)
            // error
        }

        const sessionTokenName = Cache._vars.security.kerLockerSessionHeaderName

        if (!newResponse.params.cookie[sessionTokenName] && !newResponse.params.header[sessionTokenName]) {
            // error.
            return 'ERR_NO_SESSION_TOKEN_FOUND'
        }

        newResponse.session = new ApiSession(
            req, res
        )

        // the session gets auth at this point
       await  newResponse.session.authorizeSessionToken()





        // newResponse.session.refreshSession()
        // const sTInfo = await verifyToken(newResponse.params.cookie[sessionTokenName], app.applicationSecretToken as string)

        // const sID = 1//sTInfo.sessionID
        // const __time = r.auth.tokenInfo.__time
        // // return res.dispatch(sTInfo)
        // const inputReadSession = {
        //     alias: 'session',
        //     query: 'lookUpByID',
        //     criteria: {
        //         sID: sID
        //     }
        // }
    }

    return next();
})