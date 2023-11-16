// modules
import { IRouter, NextFunction, Request, Response } from "express";

// CORE
import { Cache } from "../../ker/core/cache";
import { routerGetByRequest } from "../../api/core/router";
import { ApiResponse } from "../../api/core/response";

// ERROR
// - middleware connector
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { IRouterCache, IRouterController, IRouterControllersAllowed } from "../../api/models/router/types";
import { IAppsCache } from "../../api/models/apps/types";
import { appGetByRequest } from "../../api/core/apps";
import { setCors } from "../cors";

export const middlewareCheckRouteController = (async (req: Request, res: Response, next: NextFunction) => {
    let newResponse = res.locals.ApiResponse as ApiResponse;

    // route not found from Request
    if (!newResponse.router.route) {
        // 404
        newResponse.is404 = true
        return throwMiddlewareErr('ERR_ROUTE_NOT_FOUND', '', res, next)
    }

    // controller
    const controller = newResponse.router.route.controllers[req.method as keyof IRouterControllersAllowed]
    if (!controller) {
        newResponse.allowedMethodPassed = false
        return throwMiddlewareErr('ERR_ROUTE_METHOD_NOT_ALLOWED', `Method: ${req.method} not allowed`, res, next)
    }

    newResponse.router.controller = controller as IRouterController

    // // AUTH & SECURITY
    newResponse.router.requireSession = newResponse.router.route?.requireSession === true || controller?.requireAuth === true
    newResponse.router.requireAuth = newResponse.router.route?.requireAuth === true || controller?.requireAuth === true

    newResponse.router.CORS = newResponse.router.route?.CORS === true || controller?.CORS === true
    newResponse.router.discardCrossedRequests = newResponse.router.CORS && Cache._vars.security.discardCrossedRequests === true

    if(newResponse.router.CORS){
        setCors()
    }

    // checking route availability
    if (newResponse.router.route.metadata) {
        if (newResponse.router.route.metadata.isActive === false) {
            // error route not active
            return throwMiddlewareErr('ERR_ROUTE_IS_NOT_ACTIVE', '', res, next)
        }
    }

    return next();
})