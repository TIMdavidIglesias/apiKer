// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../api/core/response";

// ERROR
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { IRouterController } from "../../api/models/router/types";
import { validateParam } from "../../api/core/router/validation";
import { ApiError } from "../../ker/core/error";
import { IApiError } from "../../ker/models/error/types";

export const middlewareParams = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;

    const requiredRequestParams = (newResponse.router.controller as IRouterController).requiredParams || []

    // at this point, the route has params
    for (const reqParam of requiredRequestParams) {
        const paramName = reqParam.name
        const paramLocation = reqParam.location

        if (reqParam.validation) {

            const vParam = validateParam(newResponse.params[paramLocation][paramName], reqParam.validation)
            if (vParam) {
                return throwMiddlewareErr(vParam as string, ``, res, next)
            }

        }
    }

    newResponse.securityCheckRequiredRouterParamsPased = true

    return next();
})