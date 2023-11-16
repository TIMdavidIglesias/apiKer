export interface IApiSession {
    sessionID: string,
    userID: string,
    accountID: string,
    fingerPrint?:string,
    CSRF:string,
    time:number
    email:string
    timeout: number
}