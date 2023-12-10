import { Response } from "express"

export const Login = async (args: any) => {
    const res = args.RES as Response
    const apiResponse = res.locals.ApiResponse

    const params = apiResponse.params

    // Retrieving params from the request
    const email = params.body['email']

    // reading user document
    const inputReadUser = {
        alias: 'users',
        query: 'lookUpByEmail',
        criteria: {
            email: email,
        }
    }

    // gSix call for data reading
    const registeredUser = await args.GDOCS.read(inputReadUser, 1, true)

    if (!registeredUser) {
        // Throwing error in case of empty result
       return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_EMAIL_FAILED'))
    }

     // Throwing error in case of password mismatch
    if (!await args.UTILS.HASH.compareHashedVal(registeredUser.password, params.body['password'])) {
        return args.RESULT.dispatch(args.ERROR.newError('ERR_LOGIN_PASSWORD_FAILED'))
    }

    // composing the data for the session token
    const now = args.UTILS.TIMER.newTimer()
    const tk = {
        userID: registeredUser.id,
        time: now.getDate(),
        email: params.body['email'],
    }

    // starting new session as part of Login
    args.SESSION.startSession(tk, now)

    // in this case the controller returns the session metadata as a response
    const response = args.SESSION.getSessionResponse()

    // response dispatch
    return apiResult.dispatch(result) 
}