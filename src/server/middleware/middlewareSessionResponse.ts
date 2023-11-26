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
        (newResponse.router.requireSession ||
            newResponse.router.controller?.requireSession) &&
            await (newResponse.session as ApiSession).refreshSession()

        await (newResponse.session as ApiSession).setSessionResponse()
    }

    return next();
})