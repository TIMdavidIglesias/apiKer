// import { IFilterArgs } from "../../../../ker/src/models/controller/types"

export const SessionCheckpoint = async (args: any) => {
    // const res = args.RESULT
    // const params = args.REQUEST.getParams()

    // // args.ERROR.defineNewError('ERR_CUSTOM_NEW_ERROR', 500, 'new error defined', 'new error defined', 'additionalInfo')

    // // args.SESSION.refreshSession()
    // // const cookie = args.REQUEST.getCookie('sT')

    // // const sTInfo = args.UTILS.TOKENIZER.verifyToken(res.cookie(cookie))


    // const r = args.RESPONSE.getResponse()
    // const sID = r.auth.tokenInfo.sessionID
    // const __time = r.auth.tokenInfo.__time
    // // return res.dispatch(sTInfo)
    // const inputReadSession = {
    //     alias: 'session',
    //     query: 'lookUpByID',
    //     criteria: {
    //         sID: sID
    //     }
    // }

    // // ERR_SIGNUP_EMAIL_ALREADY_EXISTS
    // const session = await args.GDOCS.read(inputReadSession)

    // if (!Array.isArray(session) || session.length === 0) {
    //     args.ERROR.defineNewError('ERR_AUTH_SESSION_NOT_FOUND', 500, 'Session not found', 'Session not found', 'Session not found')
    //     args.ERROR.throwError('ERR_AUTH_SESSION_NOT_FOUND')
    //     // const myError: IApiError = {
    //     //     name: 'ERR_AUTH_OLD_TOKEN',
    //     //     additionalInfo: `Old auth token`,
    //     // }

    //     // throw new ApiError(myError)
    // }

    // const now = args.UTILS.TIMER.newTimer()
    // const lUTT = (args.UTILS.TIMER.newTimer(__time, 'YYYYMMDDHHmmss').getDate() as number).toString().slice(0, -3)
    // const lUTS = (args.UTILS.TIMER.newTimer(session[0].lastUpdatedTime).getDate() as number).toString().slice(0, -3)

    // // The token '__date' must match to validate the sessionToken
    // // if(lUTT!==lUTS){
    // //     args.ERROR.defineNewError('ERR_AUTH_OLD_TOKEN', 500, 'Old auth token', 'Old auth token', 'Old auth token')
    // //     args.ERROR.throwError('ERR_AUTH_OLD_TOKEN')
    // // }

    // const inputUpdateSession = {
    //     alias: 'session',
    //     query: 'lookUpByID',
    //     criteria: {
    //         sID: sID
    //     },
    //     data: {
    //         lastUpdatedTime: now.getDateObject()
    //     }
    // }

    // // ERR_SIGNUP_EMAIL_ALREADY_EXISTS
    // await args.GDOCS.update(inputUpdateSession)

    // await args.SESSION.refreshSession(now)

    return args.RESULT.dispatch('')

}