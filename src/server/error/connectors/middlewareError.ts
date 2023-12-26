// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../../api/core/response";

// ERROR
import { ApiError } from "../../../ker/core/error";
import { IApiError } from "../../../ker/models/error/types";

/**
 * Middleware function to throw an API error with the provided error name and additional information.
 * 
 * @param err The name of the error.
 * @param addInfo Additional information about the error.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const throwMiddlewareErr = (err: string, addInfo: string, res: Response, next: NextFunction, exception: any|undefined=undefined) => {
    // Get the ApiResponse from the response locals
    let newResponse = res.locals.ApiResponse as ApiResponse;

    // Create an API error object with the provided name and additional information
    const myError: IApiError = {
        name: err,
        exception: exception,
        additionalInfo: addInfo
    }

    // Set the isTerminated flag to true in the ApiResponse to indicate that the request is terminated due to an error
    newResponse.isTerminated = true;

    // Pass the API error to the next middleware in the chain
    return next(new ApiError(myError));
}
