/**
 * DefaultArgs function provides the default arguments for the execution of dynamic controllers.
 * @header
 * This function depends on the following imports:
 * - { RequestTracker } from "../../ApiRequest/tracker";
 * - { ApiResult } from "../../ApiResult";
 * - { ApiEnv } from "../../ignition/ApiEnv";
 * - { ApiSetup } from "../../ignition/ApiSetup";
 * - { IFilterArgs } from "./types";
 */


import { Request, Response, NextFunction } from "express"

// CORE
import { getAllDatabases } from "../../../../ker/core/databases"
import { MongoDatabase } from "../../../../ker/core/databases/mongo"
// - types
import { IMongoDatabaseCache } from "../../../../ker/models/databases/mongo/types"

// API
import { ApiResult } from "../../result"
import { ApiResponse } from "../../response"
import { appGetByRequest } from "../../apps"
// - types
import { IApps } from "../../../models/apps/types"
import { IGSInput } from "../../../models/controller/types"

// ERROR
import { IApiCustomError, IApiError } from "../../../../ker/models/error/types"
import { ApiError } from "../../../../ker/core/error"
// - handler
import { customErrorHandler } from "../../../../ker/core/error/connectors/custom"

// UTILS
import { Randomizer } from "../../../../ker/utils/randomizer"
import { compareHash, hashVal } from "../../../../ker/utils/hashing"
import { signToken } from "../../../../ker/utils/tokenizer"
import { generateAccountNo } from "../../../../ker/utils/accountNo"
import { ApiTimer } from "../../../../ker/utils/timer"
import { encrypt } from "../../../../ker/utils/cypher"

// G6
import { gSix } from "../../../../modules/gSix"
import { Cache } from "../../../../ker/core/cache"
import { nextTick } from "process"
import { updateRoute } from "../../router/manager"
import { IRouterCache } from "../../../models/router/types"
import { ApiSession } from "../../session"

/**
 * DefaultArgs function provides the default arguments for the execution of dynamic controllers.
 * It takes an instance of `ApiResult` and a `RequestTracker` as parameters and returns an object
 * containing various default arguments for the execution.
 * @param apiResult An instance of `ApiResult` to manage the result of the controller execution.
 * @param tracker A `RequestTracker` object to track the request information.
 * @returns An object containing default arguments for the execution.
 * @header
 * This function depends on the following imports:
 * - { RequestTracker } from "../../ApiRequest/tracker";
 * - { ApiResult } from "../../ApiResult";
 * - { ApiEnv } from "../../ignition/ApiEnv";
 * - { ApiSetup } from "../../ignition/ApiSetup";
 * - { IFilterArgs } from "./types";
 */

export class DefaultArgs {
    public args: any

    // public apiResult: ApiResult
    private constrollerStorage: { [k: string]: any }

    constructor(apiResult: ApiResult, constrollerStorage: { [k: string]: any }, requestParams: { [k: string]: any }, req: Request, res: Response, next: NextFunction) {
        // this.apiResult = apiResult
        this.constrollerStorage = constrollerStorage

        this.args = {
            ENV: {
                // getLogDestination: () => { return Cache._env.getLogFilePath() }
            },
            RES: {
                // getLogDestination: () => { return Cache._env.getLogFilePath() }
                res: res
            },
            SESSION: {
                createNewSession: (tokenInfo: { [k: string]: any }, timer: ApiTimer | undefined) => { ((res.locals.ApiResponse as ApiResponse).session as ApiSession).createNewSession(tokenInfo, timer) },
                startSession: (tokenInfo: { [k: string]: any }, timer: ApiTimer | undefined) => { ((res.locals.ApiResponse as ApiResponse).session as ApiSession).startSession(tokenInfo, timer) },
                getSessionResponse: () => { return((res.locals.ApiResponse as ApiResponse).session as ApiSession).getSessionMetadata()},
            },
            REQ: {
                // getLogDestination: () => { return Cache._env.getLogFilePath() }
                req: req
            },
            RESULT: {
                dispatch: (result: any) => { apiResult.dispatch(result) },
            },
            DATABASES: {
                newDBConnection: (db: IMongoDatabaseCache) => {
                    return new MongoDatabase(db)
                },
            }, ERROR: {
                newError: (errorName: string, additionalInfo: string) => {
                    const myError: IApiError = {
                        name: errorName,
                        additionalInfo: additionalInfo
                    }

                    const r = (res.locals.ApiResponse as ApiResponse)
                    r.isError = true
                    r.success = false
                    r.error = new ApiError(myError)
                    return r.error
                }
            },
            GDOCS: {
                create: async (input: IGSInput) => {
                    this.g6Wrapper()
                    const gs = this.constrollerStorage['gS'] as gSix
                    try {
                        return await gs.createRecord(input.alias, input.data || {})
                    } catch (exception) {
                        return exception
                    }
                }, read: async (input: IGSInput, limit: number = 0, raw: boolean = true) => {
                    this.g6Wrapper()
                    const gs = this.constrollerStorage['gS'] as gSix

                    try {
                        return await gs.readRecord(input.alias, input.query || '', input.criteria, limit, raw)
                    } catch (exception) {
                        return exception
                    }
                }, update: async (input: IGSInput) => {
                    this.g6Wrapper()
                    const gs = this.constrollerStorage['gS'] as gSix

                    try {
                        return await gs.updateRecord(input.alias, input.query || '', input.criteria, input.data)
                    } catch (exception) {
                        return exception
                    }
                }
            },
            UTILS: {
                RANDOMIZER: {
                    generateString: (len: number, mode: string[] = ['caps', 'lows', 'nums']) => {
                        return Randomizer.RandomString(len, mode)
                    }
                },
                HASH: {
                    getHashedVal: async (hashRounds: number, val: string) => {
                        return await hashVal(hashRounds, val)
                    },
                    compareHashedVal: async (hash: string, compareVal: string) => {
                        return await compareHash(hash, compareVal)
                    }
                },
                TOKENIZER: {
                    signToken: async (payload: any, secret: string) => {
                        return await signToken(payload, secret)
                    },
                    verifyToken: async (token: string, secret: string) => {
                        return await signToken(token, secret)
                    }
                },
                ACCOUNT: {
                    generateAccNoPair: () => {
                        return generateAccountNo()
                    }
                },
                TIMER: {
                    newTimer: (date: string | number | Date = "now", inputFormat: string = "YYYYMMDD") => {
                        return new ApiTimer(date, inputFormat)
                    }
                },
            },
            // SESSION: {
            //     startNewSession: async (token: any, timer: ApiTimer | undefined = undefined) => {
            //         const newCSRFToken = this.args.UTILS.RANDOMIZER.generateString(32)
            //         const r = (res.locals.ApiResponse as ApiResponse)

            //         const now = timer ? timer : new ApiTimer()

            //         const app = r.app as IApps
            //         const options = {
            //             maxAge: app.config.session.policy.timeOutMinutes * 60 * 1000,
            //         }

            //         const tk = {
            //             ...token,
            //             CSRF: newCSRFToken,
            //             __time: now.getDate('YYYYMMDDHHmmss'),
            //             sessionTime: now.getDateObject(),
            //             timeout: app.config.session.policy.timeOutMinutes,
            //             appID: app.metadata?.appID
            //         }

            //         if (app.config.session.policy.requireFingerPrint) {
            //             tk.fingerPrint = encrypt(req.headers[app.config.session.fingerPrintHeaderName] as string, app.encryptionKey)
            //         }

            //         const sT = await this.args.UTILS.TOKENIZER.signToken(tk, app.applicationSecretToken)

            //         // if (app.config.session.sessionTokenByCookie === true) {
            //         //     this.args.RESPONSE.setCookie('sT', sT)
            //         // } else {

            //         this.args.RESPONSE.setCookie('sT', sT, { ...options, httpOnly: true })

            //         // only with testing purposes
            //         this.args.RESPONSE.setCookie('sD', {
            //             __time: now.getDate('YYYYMMDDHHmmss'),
            //             sessionTime: now.getDateObject(),
            //             timeout: app.config.session.policy.timeOutMinutes,
            //             appID: app.metadata?.appID
            //         }, { ...options, httpOnly: false })

            //         res.set('CSRF', newCSRFToken);
            //         // this.args.RESPONSE.setHeader('CSRF', newCSRFToken)
            //     }, refreshSession: async (timer: ApiTimer | undefined = undefined) => {
            //         const t = timer || new ApiTimer()
            //         const newCSRFToken = this.args.UTILS.RANDOMIZER.generateString(32)

            //         const now = timer ? timer : new ApiTimer()

            //         const r = (res.locals.ApiResponse as ApiResponse)
            //         const app = r.app as IApps
            //         const options = {
            //             maxAge: app.config.session.policy.timeOutMinutes * 60,
            //         }
            //         const tk = {
            //             ...(r.auth?.tokenInfo || {}),
            //             CSRF: newCSRFToken,
            //             __time: now.getDate('YYYYMMDDHHmmss'),
            //             sessionTime: now.getDateObject(),
            //             timeout: app.config.session.policy.timeOutMinutes,
            //             appID: app.metadata?.appID
            //         }

            //         if (app.config.session.policy.requireFingerPrint) {
            //             tk.fingerPrint = encrypt(req.headers[app.config.session.fingerPrintHeaderName] as string, app.encryptionKey)
            //         }

            //         const sT = await this.args.UTILS.TOKENIZER.signToken(tk, app.applicationSecretToken)

            //         // if (app.config.session.sessionTokenByCookie === true) {
            //         //     this.args.RESPONSE.setCookie('sT', sT)
            //         // } else {
            //         this.args.RESPONSE.setCookie('sT', sT, { ...options, httpOnly: true })

            //         // only with testing purposes
            //         this.args.RESPONSE.setCookie('sD', {
            //             __time: now.getDate('YYYYMMDDHHmmss'),
            //             sessionTime: now.getDateObject(),
            //             timeout: app.config.session.policy.timeOutMinutes,
            //             appID: app.metadata?.appID
            //         }, { ...options, httpOnly: false })                    // }

            //         res.set('CSRF', newCSRFToken);
            //         // this.args.RESPONSE.setCookie('CSRF', newCSRFToken)
            //     }
            // },
            CACHE: {
                APPS: {
                    getAppByRequest: () => {
                        return appGetByRequest(req) as IApps
                    }
                }, DATABASES: {
                    getAllDatabases: () => {
                        return getAllDatabases() as IMongoDatabaseCache[]
                    }
                }, ROUTER: {
                    getAllRoutes: () => {
                        return Cache._router
                    },
                    updateRoutesArray: (routerData: IRouterCache) => {
                        return updateRoute(routerData)
                    }
                }
            },
            REQUEST: {
                getParams: () => {
                    return (res.locals.ApiResponse as ApiResponse).params
                },
                getCookie: (cookie: string) => {
                    return req.cookies[cookie]
                }
            },
            RESPONSE: {
                getResponse: () => res.locals.ApiResponse as ApiResponse,
                setCookie: (cookie: string, value: string, options: any = {}) => {
                    res.cookie(cookie, value, options);
                },
                setHeader: (header: string, value: string) => {
                    res.set(header, value);
                }
            },

            METADATA: {
                req: req
            },
            _EVENTS: {
                onError: (errorName: string, cb: any) => {
                    console.log(cb instanceof ApiError)
                    if (cb instanceof ApiError) this.args.ERROR.throwError(errorName)
                }
            }

        }
    }

    private g6Wrapper() {
        if (this.constrollerStorage['gS']) {
            return this.constrollerStorage['gS']
        } else {
            this.constrollerStorage['gS'] = new gSix()
        }
    }
}