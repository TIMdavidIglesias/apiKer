export interface IApiSession {
    sessionID: string,
    userID: string,
    CSRF:string,
    time:number
    email:string
    timeout: number
    permissionLevel: number
}