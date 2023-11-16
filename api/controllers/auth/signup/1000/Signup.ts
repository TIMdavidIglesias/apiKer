// import { IFilterArgs } from "../../../../../ker/src/models/controller/types"

import { ApiSession } from "../../../../../src/api/core/session"

export const Signup = async (args: any) => {
    const res = args.RESPONSE.getResponse()
    const params = args.REQUEST.getParams() || {}

    // CUSTOM ERROR DEFINER
    // args.ERROR.defineNewError('ERR_SIGNUP_EMAIL_ALREADY_EXISTS', 401, 'new error defined', 'new error defined', 'additionalInfo')
    // args.ERROR.throwError('ERR_CUSTOM_NEW_ERROR')

    console.log(1)

    const app = res.app
    const now = args.UTILS.TIMER.newTimer()
    const hashPass = await args.UTILS.HASH.getHashedVal(10, params.body['password'])
    const accNoPair = args.UTILS.ACCOUNT.generateAccNoPair()

    // CREATE NEW USER
    const inputCreateUser = {
        alias: 'users',
        data: {
            email: params.body['email'],
            firstName: params.body['firstName'],
            lastName: params.body['lastName'],
            password: hashPass,
            publicName: params.body['email'] + '____',
            allowedAppGroup: app.group,
            registerAppID: app.metadata.appID,
            maxPermission: app.config.signup.maxPermission,
        }
    }

    // ERR_SIGNUP_EMAIL_ALREADY_EXISTS
    const createUser = await args.GDOCS.create(inputCreateUser)
    if (!createUser) {
        return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_EMAIL_FAILED'))
     }

    const inputCreateAccount = {
        alias: 'accounts',
        data: {
            email: params.body['email'],
            accountNo: accNoPair['accountNo'],
            publicAccountNo: accNoPair['publicAccountNo'],
            whiteListedUsers: createUser.id,
            users: createUser.id,
            tt: 'g1ssssss',
            allowedAppGroup: app.group,
            registerAppID: app.metadata.appID,
            maxPermission: app.config.signup.maxPermission,
        }
    }

    const createAccount = await args.GDOCS.create(inputCreateAccount)
    if (!createAccount) {
        return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_EMAIL_FAILED'))
     }

    const inputSession = {
        alias: 'session',
        data: {
            email: params.body['email'],
            userID: createUser.id,
            allowedAppGroup: app.group,
            registerAppID: app.metadata.appID,
            accountID: createAccount.id,
            startTime: now.getDate('ISO'),
            lastUpdatedTime: now.getDate('ISO'),
            sessionAliveMins: app.config.session.policy.timeOutMinutes,
        }
    }

    const createSession = await args.GDOCS.create(inputSession)
    if (!createSession) {
        return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_EMAIL_FAILED'))
     }

    // Session tokenization
    const tk = {
        sessionID: createSession.id,
        userID: createUser.id,
        time: now.getDate(),
        email: params.body['email'],
    }

    await ApiSession.startNewSession(tk, now, args.RES.res)

    return args.RESULT.dispatch('')
}