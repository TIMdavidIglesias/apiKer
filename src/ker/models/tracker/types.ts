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
    discardCrossedRequests: boolean,

    requireAuth: boolean
    requireSession: boolean
    requiredIPFilter: boolean
  },
  result?: ITrackerMetadataResult,
  error?: ITrackerMetadataError,
  response: {
    code: number
  }
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
  securityCheckNativeCORSPassed: boolean,
  securityCheckAllowedAppPassed: boolean,
  securityCheckHostListFilteringPassed: boolean,

  securityCheckRequiredDefaultHeadersPased: boolean,
  securityCheckRequiredRouterParamsPased: boolean
  securityCheckRequiredRouterHeadersPased: boolean,
  securityCheckProxyPassed: boolean,
  securityCheckRequiredAuthHeadersPased: boolean,
}

export interface ITrackerSession {
  startTime: number,
  success: boolean,
  appID: number
  // endTime: number,
  // success: boolean,
}