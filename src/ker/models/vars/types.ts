export interface IVarsTracing {
  database?: string,
  traces:{
    tracePublicRequest: boolean,
    trace404Request: boolean,
    traceErrorRequest: boolean,
    traceSuccessRequest: boolean,
  }
}

export interface IVarsRequestHeaders {
  requiredDefaultHeaders: string[]
}

export interface IVarsSecurity {
  discardCrossedRequests:boolean,
  saltGenerationRoundsNumber: number,
  authProtocol: 'kerLocker' | 'standard' | 'OAuth2'
  kerLockerSecretAuthHeaderName: string,
  kerLockerPublicAuthHeaderName: string,
  kerLockerSessionHeaderName: string,
  kerLockerCSRFHeaderName: string,
  proxy:IVarsSecurityProxy
}

export interface IVarsSecurityProxy {
  usingProxy: boolean
  clientIPHeaderName: string,
  proxyFlagIdentifier: string,
  allowInternalNetworkCollections:boolean
}

export interface IVarsDocumentation {
  isActive: boolean
  swaggerDocsRoute?: string
}

export interface IVarsCache {
  tracing: IVarsTracing,
  documentation: IVarsDocumentation
  security: IVarsSecurity
}