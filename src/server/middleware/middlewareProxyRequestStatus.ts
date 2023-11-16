// MODULES
import { NextFunction, Request, Response } from "express";

// CORE
import { Cache } from "../../ker/core/cache";

// ERROR
// - middleware connector
import { ApiCommandConsole } from "../../ker/utils/console";

export const middlewareProxyRequestStatus = (async (req: Request, res: Response, next: NextFunction) => {

    const allowLanConnections = Cache._vars.security.proxy.allowInternalNetworkCollections
    const proxyFlag = Cache._vars.security.proxy.proxyFlagIdentifier

    if (!req.headers[proxyFlag] && !allowLanConnections) {
        ApiCommandConsole.showConsoleMessage(`Warning. apiKer is setup to work behind a proxy but no proxy-flag header found`, 2)
        return
    }

    const IPHeaderName = Cache._vars.security.proxy.clientIPHeaderName;

    if (!req.headers[IPHeaderName] && !allowLanConnections) {
        ApiCommandConsole.showConsoleMessage(`Warning. apiKer is setup to work behind a proxy but no ip header found`, 2)
        return
    }

    return next()
})