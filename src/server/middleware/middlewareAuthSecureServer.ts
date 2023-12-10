// MODULES
import { NextFunction, Request, Response } from "express";
// API
import { ApiResponse } from "../../api/core/response";
import { appGetBySecretToken } from "../../api/core/apps";

// CORE
import { Cache } from "../../ker/core/cache";
import { MasterDatabase } from "../../ker/core/databases/master";

// ERROR
import { throwMiddlewareErr } from "../error/connectors/middlewareError";
import { ApiError } from "../../ker/core/error";
import { IApiError } from "../../ker/models/error/types";

// UTILS
import { Randomizer } from "../../ker/utils/randomizer";
import { ApiTimer } from "../../ker/utils/timer";
import { ApiCommandConsole } from "../../ker/utils/console";

// AUTH
import { KerLockerAuthModel } from "../../api/models/auth/model";
import { IKerLockerTempAuth } from "../../api/models/auth/types";

/**
 * Middleware for securing the authentication server.
 * This middleware handles KerLocker authentication requests, validates the secret API token,
 * generates a temporary authentication token, and sends the authentication response.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const middlewareAuthSecureServer = (async (req: Request, res: Response, next: NextFunction) => {
    // Extract variables from res.locals.ApiResponse
    let newResponse = res.locals.ApiResponse as ApiResponse;

    // Set flags and request type in the ApiResponse
    newResponse.isKLKAuthRequest = true;
    newResponse.requestType = 'auth';
    newResponse.success = true;

    // Retrieve the secret API token from the request headers
    const secretAppToken = req.headers[Cache._vars.security.kerLockerSecretAuthHeaderName as string];
    if (!secretAppToken) {
        // If the secret API token is missing, throw an error
        return throwMiddlewareErr('ERR_SECRET_API_AUTH_TOKEN_HEADER_MISSING', ``, res, next);
    }

    // Get the target app based on the secret API token
    const targetApp = appGetBySecretToken(secretAppToken as string);

    if (!targetApp) {
        // If the target app is not found, throw an error
        return throwMiddlewareErr('ERR_BAD_SECRET_API_AUTH_TOKEN', ``, res, next);
    }

    // Set the target app in the ApiResponse
    newResponse.app = targetApp;

    // Generate a public token for temporary authentication
    const publicToken = Randomizer.RandomString(64);
    // Create a temporary authentication object
    const tmpAuth: IKerLockerTempAuth = {
        token: publicToken,
        date: new ApiTimer().getDateObject(),
        appID: targetApp.metadata?.appID as string,
        timeoutMins: 10, // Set a timeout of 10 minutes
        origin: targetApp.allowedOrigin as string
    };

    try {
        // Save the temporary authentication object to the database
        await MasterDatabase.createDocument(KerLockerAuthModel, tmpAuth);
    } catch (exception) {
        // Handle errors during the generation of a new authentication
        const myError: IApiError = {
            name: 'ERR_GENERATING_NEW_AUTH',
            exception: exception,
        };
        newResponse.success = false;
        // Log the error to the console
        ApiCommandConsole.showConsoleMessage(new ApiError(myError).getErrorSummary(), 3);
    }

    // Set the temporary authentication object in the ApiResponse
    newResponse.auth = tmpAuth;

    // Send the authentication response
    newResponse.sendAuth();

    try {
        // Track the request
        await newResponse.track();
    } catch (exception) {
        // Handle errors during tracking
        ApiCommandConsole.showConsoleMessage('Error during tracking a request', 3);
    }
});