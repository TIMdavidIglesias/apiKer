// import { IFilterArgs } from "../../../../../ker/src/models/controller/types"

import { ApiSession } from "../../../../../src/api/core/session"
import { ApiResponse } from "../../../../../src/api/core/response"

export const Login = async (args: any) => {
    const res = args.RESPONSE.getResponse()  as ApiResponse
    const params = args.REQUEST.getParams()

    // args.ERROR.defineNewError('ERR_CUSTOM_NEW_ERROR', 401, 'new error defined', 'new error defined', 'additionalInfo')

    // reading user document
    const inputReadUser = {
        alias: 'users',
        query: 'lookUpByEmail',
        criteria: {
            email: params.body['email'],
        }
    }

    // ERR_SIGNUP_EMAIL_ALREADY_EXISTS
    const registeredUser = await args.GDOCS.read(inputReadUser, 1, true)

    // args.ERROR.defineNewError('ERR_FAILED_CREDENTIALS_EMAIL', 401, 'Failed email or password', 'Failed email', 'Session not found')
    if (!registeredUser) {
       return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_EMAIL_FAILED'))
    }

    if (!await args.UTILS.HASH.compareHashedVal(registeredUser.password, params.body['password'])) {
        // args.ERROR.defineNewError('ERR_LOGIN_PASSWORD_FAILED', 500, 'Failed email or password', 'Failed password', 'Session not found')
        return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_PASSWORD_FAILED'))

    }

    const app = args.CACHE.APPS.getAppByRequest()

    // reading session document
    const inputReadSession = {
        alias: 'session',
        query: 'lookUpByUserID',
        criteria: {
            registerAppID: app.metadata.appID,
            userID: registeredUser._id.toString('hex'),
        }
    }

    // ERR_SIGNUP_EMAIL_ALREADY_EXISTS
    const userSession = await args.GDOCS.read(inputReadSession, 1, true)


    const now = args.UTILS.TIMER.newTimer()

    const inputUpdateSession = {
        alias: 'session',
        query: 'lookUpByUserID',
        data: {
            lastUpdatedTime: now.getDate('ISO'),
        },
        criteria: {
            registerAppID: app.metadata.appID,
            userID: registeredUser.id,
        }
    }

    // ERR_SIGNUP_EMAIL_ALREADY_EXISTS
    const updateSession = await args.GDOCS.update(inputUpdateSession)

    const tk = {
        sessionID: userSession.id,
        userID: registeredUser.id,
        time: now.getDate(),
        email: params.body['email'],
    }

    await ApiSession.startNewSession(tk, now, args.RES.res)

    return args.RESULT.dispatch('')

}