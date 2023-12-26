export interface IAppsHostListFiltering {
    whiteListedHosts?: string[],
    blackListedHosts?: string[],
    hostListPriority?: 'blackList' | 'whiteList',
    useHostListFilter?: boolean,
}

export type IAppsVirtualServer = IAppsHostListFiltering

export interface IAppsConfigSession {
    sessionTokenName: string,
    CSRFTokenHeaderName: string,
    policy: IAppsConfigSessionPolicy,
}

export interface IAppsConfigCPController {
    controllerName: string,
    controllerPath: string,
    controllerVersion: string,
}

export interface IAppsConfigSessionPolicy {
    timeOutMinutes: number,
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

export interface IAppsAppAuthorization {
    secretToken: string,
}

export interface IApps {
    isDefault?: boolean,
    targetDocServer?: boolean,
    appName: string,
    group: string,
    allowedOrigin?: string,
    adminEmail: string,
    encryptionKey?: string,
    applicationSecretToken?: string,
    applicationSecretTokenRefresh?: string,
    authorization?:IAppsAppAuthorization,
    metadata?: IAppsMetadata
}

export interface IAppsMetadata {
    isActive?: boolean,
    creationDate: Date,
    updatedDate: Date | undefined,
    appID?: string
}

export type IAppsCache = IApps & IAppsHostListFiltering