// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../api/core/response";

// CORE
import { setCors } from "../cors";

/**
 * Middleware to handle CORS (Cross-Origin Resource Sharing) configurations.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The function that calls the next middleware in the chain.
 */
export const middlewareCORS = ((req: Request, res: Response, next: NextFunction) => {
    let newResponse = res.locals.ApiResponse as ApiResponse;
    let CORS = newResponse.router.CORS; // Check if CORS is enabled for the route

    if (CORS) {
        setCors(); // Set CORS headers if necessary
    }
    return next();
});

