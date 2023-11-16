export interface IApiError {
    name: string
    exception?: any
    additionalInfo?: string
}

export interface IApiCustomError {
    name: string
    publicMessage: string
    code: number,
    message: string,
    additionalInfo: string,
}

export interface IApiErrorMetadata {
    name: string
    exception?: any,
    message: string,
    publicMessage: string,
    time: number,
    additionalInfo?: string,
    code: number
}

export type IApiErrorSummary = (IApiError) & IApiErrorMetadata