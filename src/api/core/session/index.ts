

// ERROR
import { ApiError } from "../../../ker/core/error"
import { IApiError } from "../../../ker/models/error/types"

// API
import { IApps, IAppsMetadata } from "../../models/apps/types"
// - utils
import { decrypt, encrypt } from "../../../ker/utils/cypher"
import { ApiTimer } from "../../../ker/utils/timer"
import { signToken, verifyToken } from "../../../ker/utils/tokenizer"

// AUTH
import { Request, Response } from "express"
import { Randomizer } from "../../../ker/utils/randomizer"
import { ApiResponse } from "../response"
import { swaggerDocComposer } from "../../../modules/swaggerDocs/composer"
import { IApiSession } from "../../models/session/types"
import { setCookie } from "../headers"
import { IRouterCache } from "../../models/router/types"
import { Cache } from "../../../ker/core/cache"
import { GDoc } from "../../../modules/gSix/gDoc"
import { gSix } from "../../../modules/gSix"

export class ApiSession {
    private req: Request
    private res: Response
    private rawJWT: string
    private CSRF: string

    private sessionPermissionLevel: number
    private responseTokenInfo: { [k: string]: any }

    private tokenInfo: { [k: string]: any }
    private cookieOptions: { [k: string]: any }

    private now: ApiTimer

    constructor(
        req: Request, res: Response
    ) {
        this.now = new ApiTimer()
        this.req = req
        this.res = res
        this.responseTokenInfo = {}

        this.tokenInfo = {}

        const apiResponse = (res.locals.ApiResponse as ApiResponse)

        this.sessionPermissionLevel = apiResponse.router.controller?.minPermissionLevel ? apiResponse.router.controller?.minPermissionLevel : apiResponse.router.route?.minPermissionLevel || 3

        const sessionTokenName = Cache._vars.security.kerLockerSessionHeaderName
        const CSRFTokenName = Cache._vars.security.kerLockerCSRFHeaderName

        this.rawJWT = apiResponse.params.cookie[sessionTokenName] || apiResponse.params.header[sessionTokenName]
        this.CSRF = apiResponse.params.header[CSRFTokenName]

        this.cookieOptions = {
            maxAge: Cache._vars.session.sessionTimeoutMinutes * 60 * 1000,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
    }

    public async createNewSession(tokenInfo: { [k: string]: any }, timer: ApiTimer | undefined = undefined) {
        const apiResponse = (this.res.locals.ApiResponse as ApiResponse)
        const app = (apiResponse.app as IApps)
        this.now = timer || this.now
        this.tokenInfo = tokenInfo

        const inputSession = {
            alias: 'session',
            data: {
                ...tokenInfo,
                allowedAppGroup: app.group,
                registerAppID: (app.metadata as IAppsMetadata).appID,
                startTime: this.now?.getDateObject(),
                lastUpdatedTime: this.now?.getDateObject(),
                sessionAliveMins: Cache._vars.session.sessionTimeoutMinutes,
                permissionLevel: 3,
                requestHistory:apiResponse.requestID
            }
        }

        const createSession = await new gSix().createRecord(inputSession.alias, inputSession.data)
        if (!createSession) {
            const myError: IApiError = {
                name: 'ERR_ERROR_CREATING_NEW_SESSION',
            }

            throw new ApiError(myError)
        }
    }

    public async authorizeSessionToken() {
        const apiResponse = (this.res.locals.ApiResponse as ApiResponse)
        const app = apiResponse.app as IApps

        try {
            const secret = app.applicationSecretToken
            this.tokenInfo = await verifyToken(this.rawJWT, secret as string) as IApiSession

            if (apiResponse.router.route?.CSRF || apiResponse.router.controller?.CSRF) {
                const targetCSRF = this.tokenInfo.CSRF

                if (targetCSRF !== this.CSRF) {
                    const myError: IApiError = {
                        name: 'ERR_CSRF_DOES_NOT_MATCH',
                    }

                    throw new ApiError(myError)
                }
            }

            // checks session times
            this.sessionPermissionLevel = this.tokenInfo.permissionLevel
            const targetPermision = apiResponse.router.controller?.minPermissionLevel ? apiResponse.router.controller?.minPermissionLevel : apiResponse.router.route?.minPermissionLevel || 3
            if (targetPermision > this.sessionPermissionLevel) {

                const myError: IApiError = {
                    name: 'ERR_LOW_PERMISSION_LEVEL',
                }

                throw new ApiError(myError)

            }


            const targetSessionTime = this.tokenInfo.time
            const sessionTimeout = this.tokenInfo.timeout
            const timeCheck = targetSessionTime + sessionTimeout * 60 * 1000 //ms
            const timeNow = new ApiTimer().getDate()

            // if (timeNow as number > timeCheck) {
            //     const myError: IApiError = {
            //         name: 'ERR_SESSION_EXPIRED',
            //         additionalInfo: `Session expired`
            //     }

            //     throw new ApiError(myError)
            // }

            // this.tokenInfo = vToken

            return
        } catch (ex) {
            const myError: IApiError = {
                exception: ex,
                name: 'ERR_INVALID_FALSIFIED_SESSION_TOKEN',
                additionalInfo: `Invalid session token`
            }

            throw new ApiError(myError)
        }


    }

    public async startSession(tokenInfo: any, timer: ApiTimer | undefined = undefined) {
        this.tokenInfo = tokenInfo

        const apiResponse = (this.res.locals.ApiResponse as ApiResponse)
        const app = (apiResponse.app as IApps)

        this.now = timer || this.now
        const newCSRFToken = Randomizer.RandomString(32)

        this.tokenInfo = {
            ...tokenInfo,
            CSRF: newCSRFToken,
            __time: this.now.getDate('YYYYMMDDHHmmss'),
            sessionTime: this.now.getDateObject(),
            timeout: Cache._vars.session.sessionTimeoutMinutes,
            appID: app.metadata?.appID
        }

        this.res.set('CSRF', newCSRFToken);


        // const sT = await signToken(tk, app.applicationSecretToken as string)

        // // session cfg
        // const sessionTokenName = Cache._vars.security.kerLockerSessionHeaderName
        // const CSRFTokenName = Cache._vars.security.kerLockerCSRFHeaderName

        // setCookie(this.res, sessionTokenName, sT, options)
        // setCookie(this.res, sessionTokenName + '_data', {
        //     __time: now.getDate('YYYYMMDDHHmmss'),
        //     sessionTime: now.getDateObject(),
        //     timeout: Cache._vars.session.sessionTimeoutMinutes,
        //     appID: app.metadata?.appID
        // }, { ...options, httpOnly: false })


    }


    public async refreshSession(timer: ApiTimer | undefined = undefined) {
        const apiResponse = (this.res.locals.ApiResponse as ApiResponse)
        const app = apiResponse.app as IApps

        const newCSRFToken = Randomizer.RandomString(32)

        this.now = timer || this.now

        this.tokenInfo = {
            ...(this.tokenInfo || {}),
            CSRF: newCSRFToken,
            __time: this.now.getDate('YYYYMMDDHHmmss'),
            sessionTime: this.now.getDateObject(),
            timeout: Cache._vars.session.sessionTimeoutMinutes,
            appID: app.metadata?.appID
        }

        const inputUpdateSession = {
            alias: 'session',
            query: 'lookUpByUserID',
            criteria: {
                userID: this.tokenInfo.userID
            },
            data: {
                lastUpdatedTime: this.now.getDateObject(),
                requestHistory:apiResponse.requestID
            }
        }

        // ERR_SIGNUP_EMAIL_ALREADY_EXISTS
        await new gSix().updateRecord(inputUpdateSession.alias, inputUpdateSession.query, inputUpdateSession.criteria, inputUpdateSession.data)

        this.res.set('CSRF', newCSRFToken);
    }

    public setSessionResponse = async () => {
        const apiResponse = (this.res.locals.ApiResponse as ApiResponse)
        const app = (apiResponse.app as IApps)
        const applicationSessionToken = app.applicationSecretToken as string

        const sT = await signToken(this.tokenInfo, applicationSessionToken as string)

        // session cfg
        const sessionTokenName = Cache._vars.security.kerLockerSessionHeaderName
        const CSRFTokenName = Cache._vars.security.kerLockerCSRFHeaderName

        setCookie(this.res, sessionTokenName, sT, this.cookieOptions)
        setCookie(this.res, sessionTokenName + '_data', {
            __time: this.now.getDate('YYYYMMDDHHmmss'),
            sessionTime: this.now.getDateObject(),
            timeout: Cache._vars.session.sessionTimeoutMinutes,
            appID: app.metadata?.appID
        }, { ...this.cookieOptions, httpOnly: false })


    }

    public getSessionMetadata = () => {
        return {
            CSRF: this.CSRF,
            permissionLevel: this.sessionPermissionLevel,
        }
    }
}