// modules
import  { Request, Response, NextFunction } from "express";

// API
import { ApiResponse } from "../../api/core/response";

// ERROR
import { ApiError } from "../../ker/core/error";

/**
 * Middleware for handling errors in requests.
 * This middleware takes an error of type ApiError and converts it into an error response.
 * @param err The error to be handled.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The function that calls the next middleware in the chain.
 */
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const newResponse = res.locals.ApiResponse as ApiResponse;
    newResponse.isError = true;
    newResponse.success = false;
    newResponse.error = err;

    // Tracks error response
    newResponse.track();
    return newResponse.sendResponse();
};