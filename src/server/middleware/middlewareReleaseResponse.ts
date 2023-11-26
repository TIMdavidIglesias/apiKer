import { NextFunction, Request, Response } from "express";

import { ApiCommandConsole } from "../../ker/utils/console";
import { ApiResponse } from "../../api/core/response";

/**
 * Middleware function for finalizing and releasing the API response.
 * 
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const middlewareReleaseResponse = (async (req: Request, res: Response, next: NextFunction) => {
    // Instantiate a new response object
    let newResponse = res.locals.ApiResponse as ApiResponse;

    // Send the response to the client
    newResponse.sendResponse();

    try {
        // Track the request (if tracking is enabled)
        await newResponse.track();
    } catch (exception) {
        // Log an error message if tracking fails
        ApiCommandConsole.showConsoleMessage('Error during tracking a request', 3);
    }

    // Continue to the next middleware in the chain
});
