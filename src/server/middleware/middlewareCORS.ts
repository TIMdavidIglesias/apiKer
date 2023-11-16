// MODULES
import { NextFunction, Request, Response } from "express";
import cors from 'cors'
import ipRangeCheck from 'ip-range-check'
// API
import { ApiResponse } from "../../api/core/response";
import { appGetAppsAllowedOrigins, appGetByRequest } from "../../api/core/apps";
// - types
import { IRouterCache, IRouterController, IRouterControllersAllowed } from "../../api/models/router/types";

// CORE
import { Cache } from "../../ker/core/cache";
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { setCors } from "../cors";

export const middlewareCORS = ((req: Request, res: Response, next: NextFunction) => {
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let CORS = newResponse.router.CORS

    if (CORS) {
        setCors()
    }

    // if (!newResponse.params.header['origin'] && route.metadata.label !== 'AuthServer') {
    //     return throwMiddlewareErr('ERR_NO_ORIGIN_HEADER_FOUND', ``, res, next)
    // }

    // if (Cache._vars.security.discardCrossedRequests === true) {

    //     const allowedOrigins = appGetAppsAllowedOrigins()

    //     if (CORS === true && !allowedOrigins.includes(newResponse.params.header['origin'])) {
    //         // the crossed or unknown requests are discarded
    //         // once the request is terminated 
    //         res.end()
    //     }
    // }
    return next();
})