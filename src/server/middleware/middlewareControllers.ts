// modules
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../api/core/response";
import { ApiController } from "../../api/core/controllers";
// - types
import { IApps } from "../../api/models/apps/types";

// ERROR
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { ApiError } from "../../ker/core/error";

/**
 * Middleware function for handling API controllers.
 * 
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const middlewareControllers = (async (req: Request, res: Response, next: NextFunction) => {
    // Instantiate a new response object
    let newResponse = res.locals.ApiResponse as ApiResponse;

    try {
        // Create an instance of the ApiController and retrieve the app from the response
        const controller = new ApiController(newResponse);
        const app = newResponse.app as IApps;

        // Execute the controller's logic
        await controller.execute(req, res, next);

        // Set the result and success properties in the response based on the controller's result
        newResponse.result = controller.result;
        newResponse.success = controller.result?.success || false;
    } catch (exception) {
        // Handle exceptions by throwing a middleware error
        newResponse.controllerExecutionSuccess = false
        return throwMiddlewareErr((exception as ApiError).getErrorSummary().name, ``, res, next)
    }

    // Continue to the next middleware in the chain
    return next();
});
