// CORE
import { IVarsCache } from "../../src/ker/models/vars/types";

export const _vars: IVarsCache = {
  documentation: {
    // actives the SwaggerDoc connector. Required if wants SwaggerUI docs and gSix documentation
    isActive: true,

    // route required for the index page in SwaggerConnector
    swaggerDocsRoute: '/docs/index',
  },
  security: {
    /** Auth protocol to validate and authenticate requests. kerLocker is the default system designed mainly
    to get embedded on apiKer. NOT SOCIAL/oAuth2 available yet */
    authProtocol: 'kerLocker',
    kerLockerSecretAuthHeaderName: 'api-secret',
    kerLockerPublicAuthHeaderName: 'api-token',
    kerLockerSessionHeaderName: 'sessionToken',
    kerLockerCSRFHeaderName: 'csrf',

    // static number of rounds for sal generation through hashing passwords
    saltGenerationRoundsNumber: 10,

    // in case of native cors active the request can be stopped to avoid processing the request through the controller
    discardCrossedRequests: true,

    // apiKer can be set up behind a proxy to enroute the requests.  */
    proxy: {
      // in case of having a proxy server pointing to apiKer
      usingProxy: true,

      allowInternalNetworkCollections: true,

      // the proxy must be set up to send the request IP through a header
      clientIPHeaderName: 'x-real-ip',
      proxyFlagIdentifier: 'x-proxy-flag',
    }
  },
  // tracing rules the request tracker.
  tracing: {
    // defines the database where the log is stored
    database: 'mongoCoreTrace',
    traces: {
      tracePublicRequest: true,
      trace404Request: true,
      traceErrorRequest: true,
      traceSuccessRequest: true
    }
  }
};
