

// ERROR
import { ApiError } from "../../../ker/core/error"
import { IApiError } from "../../../ker/models/error/types"

// API
import { IApps } from "../../models/apps/types"
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

export class ApiSession {
    private rawJWT: string
    private CSRF: string | undefined

    public tokenInfo: IApiSession | undefined

    private res: Response
    private req: Request

    constructor(
        req: Request,
        res: Response,
        rawJWT: string,
        CSRF: string | undefined,
    ) {
        this.req = req
        this.res = res
        this.rawJWT = rawJWT
        this.tokenInfo = undefined
        this.CSRF = CSRF
    }

    public async authorizeSessionToken() {
        const res = (this.res.locals.ApiResponse as ApiResponse)
        const app = res.app as IApps

        try {
            const secret = app.applicationSecretToken
            this.tokenInfo = await verifyToken(this.rawJWT, secret) as IApiSession

            const targetCSRF = this.tokenInfo.CSRF

            if (targetCSRF !== this.CSRF) {
                const myError: IApiError = {
                    name: 'ERR_CSRF_DOES_NOT_MATCH',
                }

                throw new ApiError(myError)
            }



            // checks session times
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

    public static async startNewSession(tokenInfo: any, timer: ApiTimer | undefined = undefined, res: Response) {
        const app = res.locals.ApiResponse.app as IApps

        const newCSRFToken = Randomizer.RandomString(32)
        const now = timer ? timer : new ApiTimer()
        const options = {
            maxAge: app.config.session.policy.timeOutMinutes * 60 * 1000,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }

        const tk = {
            ...tokenInfo,
            CSRF: newCSRFToken,
            __time: now.getDate('YYYYMMDDHHmmss'),
            sessionTime: now.getDateObject(),
            timeout: app.config.session.policy.timeOutMinutes,
            appID: app.metadata?.appID
        }

        if (app.config.session.policy.requireFingerPrint && res.locals.ApiResponse.param.header.fingerprint) {
            tk.fingerPrint = encrypt(res.locals.ApiResponse.param.header.fingerprint, app.encryptionKey)
        }

        // const sT = await this.args.UTILS.TOKENIZER.signToken(tk, app.applicationSecretToken)
        const sT = await signToken(tk, app.applicationSecretToken)

        // if (app.config.session.sessionTokenByCookie === true) {
        //     this.args.RESPONSE.setCookie('sT', sT)
        // } else {

        const sessionTokenName = app.config.session.sessionTokenName
        setCookie(res,sessionTokenName, sT, options)
        setCookie(res,sessionTokenName+'_data', {
            __time: now.getDate('YYYYMMDDHHmmss'),
            sessionTime: now.getDateObject(),
            timeout: app.config.session.policy.timeOutMinutes,
            appID: app.metadata?.appID
        }, { ...options, httpOnly: false })

        res.set('CSRF', newCSRFToken);
    }


    public async refreshSession(timer: ApiTimer | undefined = undefined) {
        const res = (this.res.locals.ApiResponse as ApiResponse)
        const app = res.app as IApps

        const t = timer || new ApiTimer()
        const newCSRFToken = Randomizer.RandomString(32)

        const now = timer ? timer : new ApiTimer()
        const options = {
            maxAge: app.config.session.policy.timeOutMinutes * 60 * 1000,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }
        
        const tk = {
            ...(this.tokenInfo || {}),
            CSRF: newCSRFToken,
            __time: now.getDate('YYYYMMDDHHmmss'),
            sessionTime: now.getDateObject(),
            timeout: app.config.session.policy.timeOutMinutes,
            appID: app.metadata?.appID
        }

        const sT = await signToken(tk, app.applicationSecretToken)

        const sessionTokenName = app.config.session.sessionTokenName
        setCookie(this.res,sessionTokenName, sT, options)
        setCookie(this.res,sessionTokenName+'_data', {
            __time: now.getDate('YYYYMMDDHHmmss'),
            sessionTime: now.getDateObject(),
            timeout: app.config.session.policy.timeOutMinutes,
            appID: app.metadata?.appID
        }, { ...options, httpOnly: false })

        this.res.set('CSRF', newCSRFToken);
        return
    }
}