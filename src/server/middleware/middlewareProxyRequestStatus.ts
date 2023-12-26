// MODULES
import { NextFunction, Request, Response } from "express";

// CORE
import { Cache } from "../../ker/core/cache";

// ERROR
// - Middleware Connector
import { ApiCommandConsole } from "../../ker/utils/console";

/**
 * Middleware for handling proxy request status.
 * This middleware checks the presence of headers related to proxy configuration and logs warnings if they are missing.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next function in the Express middleware chain.
 */
export const middlewareProxyRequestStatus = (async (req: Request, res: Response, next: NextFunction) => {
    // Get configuration values from the cache
    const allowLanConnections = Cache._vars.security.proxy.allowInternalNetworkCollections;
    const proxyFlag = Cache._vars.security.proxy.proxyFlagIdentifier;
    const IPHeaderName = Cache._vars.security.proxy.clientIPHeaderName;

    // Check for the presence of the proxy flag header and log a warning if not found
    if (!req.headers[proxyFlag] && !allowLanConnections) {
        ApiCommandConsole.showConsoleMessage(`Warning. apiKer is set up to work behind a proxy, but no proxy-flag header found.`, 2);
        return;
    }

    // Check for the presence of the IP header and log a warning if not found
    if (!req.headers[IPHeaderName] && !allowLanConnections) {
        ApiCommandConsole.showConsoleMessage(`Warning. apiKer is set up to work behind a proxy, but no IP header found.`, 2);
        return;
    }

    // Continue to the next middleware in the chain
    return next();
});
