export interface IVarsTracing {
  database?: string,
  traces: {
    tracePublicRequest: boolean,
    trace404Request: boolean,
    traceErrorRequest: boolean,
    traceSuccessRequest: boolean,
  }
}

export interface IVarsSecurity {
  saltGenerationRoundsNumber: number,
  authProtocol: 'kerLocker' | 'standard'
  kerLockerSecretAuthHeaderName: string,
  kerLockerPublicAuthHeaderName: string,
  kerLockerSessionHeaderName: string,
  kerLockerCSRFHeaderName: string,
  proxy: IVarsSecurityProxy
}

export interface IVarsSecurityProxy {
  usingProxy: boolean
  clientIPHeaderName: string,
  proxyFlagIdentifier: string,
  allowInternalNetworkCollections: boolean
}

export interface IVarsDocumentation {
  isActive: boolean
  swaggerDocsRoute?: string
}

export interface IVarsSession {
  defaultAccountPermissionLevel: number
  sessionTimeoutMinutes: number
  rememberSessionTimeoutDays: number
  allowRememberSession: boolean
}

export interface IVarsCache {
  tracing: IVarsTracing,
  documentation: IVarsDocumentation
  security: IVarsSecurity,
  session: IVarsSession
}