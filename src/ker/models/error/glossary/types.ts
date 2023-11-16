export interface IApiErrorDefinition {
    name: string,
    errorCode: number,
    message: string,
    publicMessage?: string,
    additionalInfo?: string
}