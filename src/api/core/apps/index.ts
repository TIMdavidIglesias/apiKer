// modules
import { Request } from "express";

// CORE
import { Cache } from "../../../ker/core/cache";
// - types
import { IAppsCache } from "../../models/apps/types";

/**
 * Retrieves an app from the cache based on the provided request's origin header.
 * 
 * @param req The Express request object containing the origin header.
 * @returns The app that matches the origin or null if not found.
 */
export const appGetByRequest = (req: Request | undefined = undefined) => {
    if (req) {
        // Extract the origin from the request headers
        const origin = req.headers['origin'] as string;

        // Find the app that matches the origin
        return Cache._apps.find((app: IAppsCache) =>
            app.allowedOrigin === origin ||
            app.allowedOrigin + '/' === origin
        ) || null;
    } else {
        // If no request is provided, return the default app
        return Cache._apps.find((app: IAppsCache) => app.isDefault) || null;
    }
}

/**
 * Retrieves an app from the cache based on the provided secret token.
 * 
 * @param secretToken The secret token associated with the app.
 * @returns The app that matches the secret token or null if not found.
 */
export const appGetBySecretToken = (secretToken: string) => {
    return Cache._apps.find((app: IAppsCache) => app.authorization?.secretToken === secretToken) || null;
}

/**
 * Retrieves an app from the cache based on the provided app ID.
 * 
 * @param ID The app ID.
 * @returns The app that matches the app ID or null if not found.
 */
export const appGetByID = (ID: string) => {
    return Cache._apps.find((app: IAppsCache) => app.metadata?.appID === ID) || undefined;
}

/**
 * Retrieves an app from the cache based on the provided origin.
 * 
 * @param origin The allowed origin of the app.
 * @returns The app that matches the origin or null if not found.
 */
export const appGetByOrigin = (origin: string) => {
    return Cache._apps.find((app: IAppsCache) => app.allowedOrigin === origin) || undefined;
}

/**
 * Retrieves the default app from the cache.
 * 
 * @returns The default app or null if not found.
 */
export const appGetDefault = () => {
    return Cache._apps.find((app: IAppsCache) => app.isDefault) || undefined;
}

/**
 * Retrieves an array of allowed origins from all apps in the cache.
 * 
 * @returns An array of allowed origins as strings.
 */
export const appGetAppsAllowedOrigins = () => {
    return Cache._apps.map((app: IAppsCache) => app.allowedOrigin) || [];
}

/**
 * Retrieves an array of allowed origins for apps that are either default or have targetDocServer set to true.
 * 
 * @returns An array of allowed origins for target doc servers as strings.
 */
export const appGetDocTargetServers = () => {
    return Cache._apps
        .filter((app: IAppsCache) => app.isDefault || app.targetDocServer === true)
        .map((app: IAppsCache) => app.allowedOrigin) || [];
}
