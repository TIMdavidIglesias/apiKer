export interface IAppsHostListFiltering {
    whiteListedHosts?: string[],
    blackListedHosts?: string[],
    hostListPriority?: 'blackList' | 'whiteList',
    useHostListFilter?: boolean,
}

export type IAppsVirtualServer = IAppsHostListFiltering

export interface IAppsConfigSession {
    sessionTokenName: string,
    usingServerCheckpoint?: boolean,
    fingerPrintHeaderName: string,
    CSRFTokenHeaderName: string,
    policy: IAppsConfigSessionPolicy,
    checkPointController: IAppsConfigCPController,
}

export interface IAppsConfigCPController {
    controllerName: string,
    controllerPath: string,
    controllerVersion: string,
}

export interface IAppsConfigSessionPolicy {
    onExpiredToken: string,
    requireFingerPrint?: boolean,
    timeOutMinutes: number,
    rememberSession?: {
        allow: boolean,
        hoursTimeOut: number,
        param: { name: string, location: string }
    },
}

export interface IAppsConfigSignupAccountTypes {
    accountTypeId: number,
    name: string
}

export interface IAppsConfigSignup {
    accountTypeDefaultID: number,
    maxPermission: number,
    accountTypes: IAppsConfigSignupAccountTypes[]
}

export interface IAppsConfig {
    session: IAppsConfigSession,
    signup: IAppsConfigSignup
}

export interface IAppsAppAuthorization {
    secretToken: string,
}

export interface IApps {
    isDefault?: boolean,
    targetDocServer?: boolean,
    appName: string,
    group: string,
    allowedOrigin?: string,
    // virtualServer: IAppsVirtualServer,
    adminEmail: string,
    encryptionKey?: string,
    applicationSecretToken?: string,
    applicationSecretTokenRefresh?: string,
    config: IAppsConfig,
    authorization?:IAppsAppAuthorization,
    metadata?: IAppsMetadata
}

export interface IAppsMetadata {
    isActive?: boolean,
    isDeleted: boolean,
    creationDate: Date,
    updatedDate: Date | undefined,
    deletionDate: Date | undefined,
    appID?: string
}

export type IAppsCache = IApps & IAppsHostListFiltering