// modules
import { NextFunction, Request, Response } from "express";

// CORE
import { Cache } from "../../ker/core/cache";
import { ApiResponse } from "../../api/core/response";
import { setCors } from "../cors";

// ERROR
// - middleware connector
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { IRouterController, IRouterControllersAllowed } from "../../api/models/router/types";

/**
 * Middleware to check the validity of the route controller and set relevant properties in the ApiResponse.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const middlewareCheckRouteController = (async (req: Request, res: Response, next: NextFunction) => {
    let newResponse = res.locals.ApiResponse as ApiResponse;

    // If the route is not found from the Request, return a 404 error
    if (!newResponse.router.route) {
        // 404
        newResponse.is404 = true;
        return throwMiddlewareErr('ERR_ROUTE_NOT_FOUND', '', res, next);
    }

    // Get the controller based on the request method
    const controller = newResponse.router.route.controllers[req.method as keyof IRouterControllersAllowed];
    if (!controller) {
        // If the controller is not allowed for the request method, return an error
        newResponse.allowedMethodPassed = false;
        return throwMiddlewareErr('ERR_ROUTE_METHOD_NOT_ALLOWED', `Method: ${req.method} not allowed`, res, next);
    }

    // Set the controller in the ApiResponse
    newResponse.router.controller = controller as IRouterController;

    // // AUTH & SECURITY
    // Determine if session and authentication are required based on route and controller settings
    newResponse.router.requireSession = newResponse.router.route?.requireSession === true || controller?.requireAuth === true;
    newResponse.router.requireAuth = newResponse.router.route?.requireAuth === true || controller?.requireAuth === true;

    // Determine if CORS is required based on route and controller settings
    newResponse.router.CORS = newResponse.router.route?.CORS === true || controller?.CORS === true;
    newResponse.router.discardCrossedRequests = newResponse.router.CORS && Cache._vars.security.discardCrossedRequests === true;

    // Set CORS headers if CORS is required
    if (newResponse.router.CORS) {
        setCors();
    }

    // Checking route availability
    if (newResponse.router.route.metadata) {
        if (newResponse.router.route.metadata.isActive === false) {
            // If the route is not active, return an error
            return throwMiddlewareErr('ERR_ROUTE_IS_NOT_ACTIVE', '', res, next);
        }
    }

    return next();
});