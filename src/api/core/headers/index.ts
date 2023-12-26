import { Response } from "express";

/**
 * Sets a cookie in the HTTP response.
 * 
 * @param res The Express response object.
 * @param name The name of the cookie.
 * @param value The value to be stored in the cookie.
 * @param options Additional options for the cookie (e.g., expiration, domain, secure, etc.).
 */
export const setCookie = (res: Response, name: string, value: any, options: any) => {
    // Use Express's `cookie` method to set the specified cookie in the response
    res.cookie(name, value, options);
}
