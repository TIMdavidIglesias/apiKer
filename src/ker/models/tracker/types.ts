import { IRouterCache, IRouterController } from "../../../api/models/router/types"

export interface ITrackerMetadataError {
  name: string,
  exception?: any,
  message: string,
  time: number,
  additionalInfo?: string
}

export interface ITrackerMetadataController {
  controllerName: string,
  controllerPath: string,
  controllerVersion: string,
}

export interface ITracker {
  success: boolean,
  isError?: boolean,
  metadata: ITrackerMetadata
  // session?: ITrackerSession,
}

export interface ITrackerMetadata {
  requestType: string,
  proxyFlag: string,
  inputs: {
    query: { [k: string]: any },
    body: { [k: string]: any },
    path: { [k: string]: any },
    header: { [k: string]: any },
    cookie: { [k: string]: any },
  },
  router: {
    method: string,
    origin: string,
    url: string,

    CORS: boolean,

    requireAuth: boolean
    requireSession: boolean
    requiredIPFilter: boolean
  },
  result?: ITrackerMetadataResult,
  error?: ITrackerMetadataError,
  response: {
    code: number
  },
  securityChecks?: ITrackerMetadataSecurityChecks,
}

export interface ITrackerMetadataResult {
  startTime: number,
  endTime: number,
  success: boolean
}

export interface ITrackerMetadataApps {
  appID?: string,
}

export interface ITrackerMetadataRequestParams {
  [key: string]: string | string[] | undefined,
}

export interface ITrackerMetadataSecurityChecks {
  allowedMethodPassed: boolean,
  securityCheckProxyPassed: boolean,
  securityCheckRouterIsActive: boolean,
  securityCheckAuthToken: boolean,
  securityCheckRequiredRouterParamsPassed: boolean,
  controllerExecutionSuccess: boolean
  sessionAlive: boolean,
}

export interface ITrackerSession {
  startTime: number,
  success: boolean,
  appID: number
  // endTime: number,
  // success: boolean,
}