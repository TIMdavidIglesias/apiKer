// modules
import { IRouter, NextFunction, Request, Response } from "express";

// CORE
import { Cache } from "../../ker/core/cache";
import { routerGetByRequest } from "../../api/core/router";
import { ApiResponse } from "../../api/core/response";
import { IRouterCache } from "../../api/models/router/types";
import { ApiTimer } from "../../ker/utils/timer";
import { Randomizer } from "../../ker/utils/randomizer";

/**
 * Middleware for creating a new API response object.
 * This middleware instantiates a new ApiResponse object, sets various properties based on the request,
 * and continues to the next middleware in the Express chain.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const middlewareNewResponse = (async (req: Request, res: Response, next: NextFunction) => {
    // Get route information based on the request
    const routeRequest = routerGetByRequest(req);

    // New request identificatino gets generated
    const newRequestID = new ApiTimer().getDate() + Randomizer.RandomString(16)
    res.locals.requestID = newRequestID

    // Instantiate a new response object
    const newResponse = new ApiResponse(res, routeRequest?.route);

    // Set Proxy metadata
    const proxyFlag = Cache._vars.security.proxy.proxyFlagIdentifier;
    newResponse.proxyFlag = req.headers[proxyFlag] as string || 'standard';
    if(proxyFlag) newResponse.securityCheckProxyPassed = true;

    // Set parameters in the new response object
    newResponse.params.query = req.query;
    newResponse.params.body = req.body;
    newResponse.params.header = req.headers;
    newResponse.params.cookie = req.cookies;

    // Set router information in the new response object
    newResponse.router.method = req.method;
    newResponse.router.origin = req.headers['origin'] || '';
    newResponse.router.url = req.url;
    newResponse.router.route = routeRequest.route as IRouterCache;
    if (routeRequest?.params) newResponse.params.path = routeRequest?.params;

    // Set the client's IP address in the new response object based on proxy configuration
    if (Cache._vars.security.proxy.usingProxy) {
        const proxyCFG = Cache._vars.security.proxy;
        const IPHeaderName = proxyCFG.clientIPHeaderName;
        newResponse.IP = req.headers[IPHeaderName] as string;
    } else {
        newResponse.IP = req.ip || '0.0.0.0';
    }

    // Continue to the next middleware in the chain
    return next();
});
