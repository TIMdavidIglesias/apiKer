// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../api/core/response";

// ERROR
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { IRouterController } from "../../api/models/router/types";
import { validateParam } from "../../api/core/router/validation";

/**
 * Middleware for validating and processing request parameters.
 * This middleware checks and validates required parameters based on the route's configuration.
 * If validation fails, it throws an appropriate API error.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const middlewareParams = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;

    // Get the required request parameters from the router's controller configuration
    const requiredRequestParams = (newResponse.router.controller as IRouterController).requiredParams || [];

    // At this point, the route has parameters
    for (const reqParam of requiredRequestParams) {
        const paramName = reqParam.name;
        const paramLocation = reqParam.location;

        if (reqParam.validation) {
            // Validate the parameter using the specified validation rules
            const vParam = validateParam(newResponse.params[paramLocation][paramName], reqParam.validation);

            // If validation fails, throw an API error
            if (vParam) {
                return throwMiddlewareErr(vParam as string, ``, res, next);
            }
        }
    }

    // Set a flag in the ApiResponse to indicate that required router parameters have been successfully passed
    newResponse.securityCheckRequiredRouterParamsPased = true;

    // Continue to the next middleware in the chain
    return next();
});
