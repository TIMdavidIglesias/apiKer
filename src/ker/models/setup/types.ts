export interface ISetupCache {
    setupName: string,
    apiName: string,
    title?: string,
    description?: string,
    // current version of the API
    termsOfService?: string,
    contact: {
        name?: string,
        email?: string,
        url?: string,
    },
    license: {
        name?: string,
        url?: string,
    },
    version: string,
    setupTime: Date
}

export interface ISetup {
    setupName: string,
    apiName: string,
    title?: string,
    description?: string,
    // current version of the API
    termsOfService?: string,
    contact: {
        name?: string,
        email?: string,
        url?: string,
    },
    license: {
        name?: string,
        url?: string,
    },
    version: string,
}