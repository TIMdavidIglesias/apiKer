// MODULES
import { NextFunction, Request, Response } from "express";
import cors from 'cors'
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
import { ApiSession } from "../../api/core/session";
import { verifyToken } from "../../ker/utils/tokenizer";

export const middlewareSession = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let router = newResponse.router

    let route = router.route as IRouterCache;

    // CORS managed by ker
    if (newResponse.router.requireSession) {
        const app = appGetByOrigin(newResponse.router.origin)

        if (!app) {
            return ''
            // error
        }

        const sessionTokenName = app.config.session.sessionTokenName

        if (!newResponse.params.cookie[sessionTokenName]) {
            // error.
            return ''
        }

        const session = new ApiSession(req,
            res,
            newResponse.params.cookie[sessionTokenName], ''
        )

        const sTInfo = verifyToken(newResponse.params.cookie[sessionTokenName], app.applicationSecretToken as string)

        // const sID = sTInfo.sessionID
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