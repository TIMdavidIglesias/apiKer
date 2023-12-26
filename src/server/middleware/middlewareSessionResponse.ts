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
import { ApiError } from "../../ker/core/error";

export const middlewareSessionResponse = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let router = newResponse.router

    let route = router.route as IRouterCache;

    // CORS managed by ker
    if (newResponse.router.requireAuth ||
        newResponse.router.requireSession ||
        newResponse.router.controller?.requireAuth ||
        newResponse.router.controller?.requireSession) {

        // at this point session gets renewed and inserted as response
        if (newResponse.router.requireSession || newResponse.router.controller?.requireSession) {
            try {
                await (newResponse.session as ApiSession).refreshSession()
                newResponse.sessionAlive = true
            } catch (exception) {
                // Handle exceptions by throwing a middleware error
                // return throwMiddlewareErr((exception as ApiError).getErrorSummary().name, ``, res, next)
                const exError = (exception as ApiError).getErrorSummary()
                return throwMiddlewareErr(exError.name, ``, res, next, exError.exception)
            }
        }

        await (newResponse.session as ApiSession).setSessionResponse()
    }

    return next();
})