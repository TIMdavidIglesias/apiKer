// import { IFilterArgs } from "../../../../../ker/src/models/controller/types"

import { ApiSession } from "../../../../../src/api/core/session"

export const Signup = async (args: any) => {
    const res = args.RESPONSE.getResponse()
    const params = args.REQUEST.getParams() || {}

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
            maxPermission: 3,
        }
    }

    const createUser = await args.GDOCS.create(inputCreateUser)
    if (!createUser) {
        return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_EMAIL_FAILED'))
     }

     // CREATE NEW ACCOUNT
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
            maxPermission: 3,
        }
    }

    const createAccount = await args.GDOCS.create(inputCreateAccount)
    if (!createAccount) {
        return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_EMAIL_FAILED'))
     }

    // Session tokenization
    const tk = {
        userID: createUser.id,
        accountID: createAccount.id,
        email: params.body['email'],
    }

    await args.SESSION.createNewSession(tk, now)

    // return session data as response
    return args.RESULT.dispatch(args.SESSION.getSessionResponse())
}