// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { Cache } from "../../ker/core/cache";
import { ApiResponse } from "../../api/core/response";

// ERROR
import { throwMiddlewareErr } from "../error/connectors/middlewareError";

export const middlewareDefaults = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;
    
    // default headers validation
    const requiredDefaultHeaders = Cache._vars.request.headers.requiredDefaultHeaders;
    if (requiredDefaultHeaders) {
        for (const defaultHeader of requiredDefaultHeaders) {
            if (req.headers.hasOwnProperty(defaultHeader.toLowerCase())) continue
            newResponse.isTerminated = true
            return throwMiddlewareErr('ERR_REQUIRED_DEFAULT_HEADER_MISSING',`Missing header: ${defaultHeader}`, res, next)

        }
    }
   
    return next();
})