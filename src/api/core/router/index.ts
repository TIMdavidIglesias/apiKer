// TYPES
import { Request } from "express";
import { IRouterCache } from "../../models/router/types";

// CACHE
import { Cache } from "../../../ker/core/cache"

/**
 * Retrieves a router from the cache by matching its metadata label.
 * 
 * @param metadataLabel The label to match with router metadata.
 * @returns The router that matches the label, or undefined if not found.
 */
export const routerGetByMetadataLabel = (metadataLabel: string): IRouterCache | undefined => {
    return Cache._router.find((route: IRouterCache) => route.metadata?.label === metadataLabel);
}

/**
 * Retrieves a router from the cache based on the provided request URL.
 * 
 * @param req The Express request object.
 * @returns An object containing the matching route and extracted route parameters.
 */
export const routerGetByRequest = (req: Request): {
    route: IRouterCache | undefined,
    params: { [k: string]: string }
} => {
    const effRoute = req.url.split('?')[0];

    let mostSpecificRoute: {
        route: IRouterCache | undefined,
        params: { [k: string]: string }
    } | null = null;

    for (const route of Cache._router) {
        const routeParts = route.route.split('/');
        const urlParts = effRoute.split('/');

        if (routeParts.length !== urlParts.length) {
            continue;
        }

        const params: { [key: string]: string } = {};
        let isMatch = true;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i] === urlParts[i]) {
                continue;
            } else if (routeParts[i].startsWith('{') && routeParts[i].endsWith('}')) {
                const paramName = routeParts[i].slice(1, -1);
                params[paramName] = urlParts[i];
            } else {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            if (
                mostSpecificRoute === null ||
                mostSpecificRoute.route && route.route.length > mostSpecificRoute.route.route.length
            ) {
                mostSpecificRoute = { route, params };
            }
        }
    }

    return mostSpecificRoute || {
        route: undefined,
        params: {}
    };
}

/**
 * Extracts path parameters enclosed in curly braces from a route path.
 * 
 * @param path The route path containing path parameters.
 * @returns An array of path parameters as strings.
 */
export const getPathParamList = (path: string) => {
    const expresionRegular = /\{([^}]+)\}/g;
    const coincidencias = [];
    let coincidencia;

    while ((coincidencia = expresionRegular.exec(path)) !== null) {
        coincidencias.push(coincidencia[1]);
    }

    return coincidencias;
}

/**
 * Parses a URL by splitting it into segments using slashes and removing query parameters.
 * 
 * @param fullURL The full URL to parse.
 * @returns An array of URL segments.
 */
export const parseURL = (fullURL: string) => {
    return fullURL.split('?')[0].split('/')
}