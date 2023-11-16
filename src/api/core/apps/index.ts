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
        const origin = req.headers['origin'] as string
        return Cache._apps.filter((app: IAppsCache) =>
            app.allowedOrigin === origin ||
            app.allowedOrigin + '/' === origin
        )[0];
    } else {
        return Cache._apps.find((app: IAppsCache) => app.isDefault) as IAppsCache
    }

}


export const appGetBySecretToken = (secretToken: string) => {
    return Cache._apps.find((app: IAppsCache) => app.authorization?.secretToken === secretToken);
}

export const appGetByID= (ID: string) => {
    return Cache._apps.find((app: IAppsCache) => app.metadata?.appID === ID);
}

export const appGetByOrigin= (origin: string) => {
    return Cache._apps.find((app: IAppsCache) => app.allowedOrigin === origin);
}

/**
 * Retrieves the default app from the cache.
 * 
 * @returns The default app or null if not found.
 */
export const appGetDefault = () => {
    return Cache._apps.find((app: IAppsCache) => app.isDefault) as IAppsCache;
}

/**
 * Retrieves an array of allowed origins from all apps in the cache.
 * 
 * @returns An array of allowed origins as strings.
 */
export const appGetAppsAllowedOrigins = () => {
    return Cache._apps.map((app: IAppsCache) => app.allowedOrigin) as string[];
}

/**
 * Retrieves an array of allowed origins for apps that are either default or have targetDocServer set to true.
 * 
 * @returns An array of allowed origins for target doc servers as strings.
 */
export const appGetDocTargetServers = () => {
    return Cache._apps.filter((app: IAppsCache) => app.isDefault || app.targetDocServer === true).map((app: IAppsCache) => app.allowedOrigin) as string[];
}