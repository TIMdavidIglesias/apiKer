// MODULES
import { NextFunction, Request, Response } from "express";
import cors from 'cors'

// API
import { ApiResponse } from "../../api/core/response";
import { appGetAppsAllowedOrigins, appGetByRequest } from "../../api/core/apps";
// - types
import { IRouterCache, IRouterController, IRouterControllersAllowed } from "../../api/models/router/types";
import { IAppsCache } from "../../api/models/apps/types";

// ERROR
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { Cache } from "../../ker/core/cache";

export const middlewareFilterList = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;

    let router = newResponse.router
    let app = newResponse.app as IAppsCache

    let route = router.route as IRouterCache;

    if (app.useHostListFilter) {
        newResponse.requireHostListFiltering = true

        const requestIP = newResponse.IP

        if (app.hostListPriority === 'blackList') {
            if (app.blackListedHosts?.includes(requestIP) || app.blackListedHosts?.includes('*')) {
                return throwMiddlewareErr('ERR_HOST_BLACKLISTED', ``, res, next)
            }
        }

        if (app.hostListPriority === 'whiteList') {
            if (!app.whiteListedHosts?.includes(requestIP) && !app.whiteListedHosts?.includes('*')) {
                return throwMiddlewareErr('ERR_HOST_NOT_WHITELISTED', ``, res, next)
            }
        }

        newResponse.securityCheckHostListFilteringPassed = true
        //         //track
        //         // tracker.setSecurityHostListFilterMetadata(false, false)
    }

    //     newResponse.securityCheckNativeCORSPassed = true
    newResponse.appID = app.metadata?.appID as string

    // } else {
    //     newResponse.appID = 'CORS SKIPPED -> undefined app'
    //     newResponse.router.origin = 'CORS SKIPPED -> undefined origin'


    // newResponse.requestIP = `${req.ip} (ip)/${req.socket.remoteAddress} (remoteAddress)`

    return next();
})