// modules
import { IRouter, NextFunction, Request, Response } from "express";

// CORE
import { Cache } from "../../ker/core/cache";
import { routerGetByRequest } from "../../api/core/router";
import { ApiResponse } from "../../api/core/response";
import { IRouterCache } from "../../api/models/router/types";

export const middlewareNewResponse = (async (req: Request, res: Response, next: NextFunction) => {
    // Instantiate a new response object

    // ignoring routes by setupCFG
    const routeRequest = routerGetByRequest(req)
    const newResponse = new ApiResponse(res, routeRequest?.route)

    // params
    newResponse.params.query = req.query
    newResponse.params.body = req.body
    newResponse.params.header = req.headers
    newResponse.params.cookie = req.cookies

    // router
    newResponse.router.method = req.method
    newResponse.router.origin = req.headers['origin'] || ''
    newResponse.router.url = req.url
    newResponse.router.route = routeRequest.route as IRouterCache
    if (routeRequest?.params) newResponse.params.path = routeRequest?.params

    // - ip
    if (Cache._vars.security.proxy.usingProxy) {
        const proxyCFG = Cache._vars.security.proxy
        const IPHeaderName = proxyCFG.clientIPHeaderName
        newResponse.IP = req.headers[IPHeaderName] as string
    } else {
        newResponse.IP = req.ip || '0'
    }

    // proxy checkpoint
    newResponse.securityCheckProxyPassed = true
    
    return next();
})