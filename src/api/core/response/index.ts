// modules
import { Response } from "express";

// CORE
import { Cache } from "../../../ker/core/cache";
import { MasterDatabase } from "../../../ker/core/databases/master";

// - utils
import { ApiTimer } from "../../../ker/utils/timer";
import { Randomizer } from "../../../ker/utils/randomizer";
import { ApiCommandConsole } from "../../../ker/utils/console";

// API
import { ApiResult } from "../result";

// - types
import { IApps } from "../../models/apps/types";
import { IRouterCache, IRouterController } from "../../models/router/types";


// ERROR
import { ApiError } from "../../../ker/core/error";
import { IApiError } from "../../../ker/models/error/types";
import { ApiSession } from "../session";
import { boolean } from "yup";
import { IKerLockerTempAuth } from "../../models/auth/types";
import { ITracker, ITrackerMetadata } from "../../../ker/models/tracker/types";
import { TrackerModel } from "../../../ker/models/tracker/model";


// import { ITracker, ITrackerMetadata } from "../../models/tracker/types";

// import { KerLocker } from "../../auth/kerLocker";
// import { TrackerModel } from "../../models/tracker/model";

export class ApiResponse {
    // static
    private nowApiTimer: ApiTimer

    public res: Response

    public requestType: string

    // main request params
    public params: {
        query: { [k: string]: any },
        body: { [k: string]: any },
        path: { [k: string]: any },
        header: { [k: string]: any },
        cookie: { [k: string]: any },
    }

    public router: {
        route: IRouterCache | undefined,
        method: string,
        origin: string,
        url: string,
        controller: IRouterController | undefined,

        CORS: boolean,
        discardCrossedRequests: boolean,

        requireAuth: boolean
        requireSession: boolean
        requiredIPFilter: boolean
    }

    // APP
    public appID: string | undefined
    public app: IApps | undefined

    // IP & CLIENT
    public IP: string

    // API AUTH
    public auth: IKerLockerTempAuth | undefined
    public session: ApiSession | undefined

    // RESULT & ERROR
    public result: ApiResult | undefined
    public success: boolean
    public is404: boolean
    public isTerminated: boolean
    public isKLKAuthRequest: boolean
    public isError: boolean
    public error: ApiError | undefined




    public requireHostListFiltering: boolean

    // public fingerPrint: string

    // securityChecks
    public allowedMethodPassed: boolean
    public securityCheckProxyPassed: boolean


    public securityCheckRequiredAuthHeadersPased: boolean
    public securityCheckRequiredDefaultHeadersPased: boolean
    public securityCheckRequiredRouterHeadersPased: boolean
    public securityCheckRequiredRouterParamsPased: boolean
    public securityCheckHostListFilteringPassed: boolean
    public securityCheckAllowedAppPassed: boolean
    public securityCheckNativeCORSPassed: boolean



    constructor(res: Response, route: IRouterCache | undefined) {
        this.res = res

        this.nowApiTimer = new ApiTimer()

        this.requestType = 'api'

        // params
        this.params = {
            query: {},
            body: {},
            path: {},
            header: {},
            cookie: {}
        }

        this.router = {
            CORS: true,
            discardCrossedRequests: true,
            route: undefined,
            origin: '',
            method: '',
            url: '',
            requireAuth: true,
            requireSession: true,
            controller: undefined,
            requiredIPFilter: false
        }

        this.IP = ''

        // response status
        this.success = false
        this.isError = false
        this.isTerminated = false
        this.isKLKAuthRequest = false
        this.is404 = false

        // app
        this.app = undefined

        this.auth = undefined
        this.session = undefined

        // auth
        // this.requireAuth = false
        // this.CSRF = ''
        // this.fingerPrint = ''
        // this.auth = undefined

        // this.origin = ''

        // this.CSRFCheckPassed = false
        // this.CSRFCheckPassed = false

        this.requireHostListFiltering = false


        this.allowedMethodPassed = true

        this.securityCheckProxyPassed = false
        this.securityCheckRequiredAuthHeadersPased = false
        this.securityCheckNativeCORSPassed = false
        this.securityCheckRequiredDefaultHeadersPased = false
        this.securityCheckRequiredRouterHeadersPased = false
        this.securityCheckRequiredRouterParamsPased = false
        this.securityCheckHostListFilteringPassed = false
        this.securityCheckAllowedAppPassed = false

        this.nowApiTimer = new ApiTimer()
        res.locals.ApiResponse = this

        this.result = undefined
    }

    // public is404error() {
    //     if (!this.router.route) return true
    //     return false
    // }

    public sendResponse() {
        if (this.isError) {
            const err = (this.error as ApiError).getErrorSummary()
            return this.res.status(err.code).send({
                success: this.success,
                error: err.publicMessage || err.message,
                additionalInfo: err.additionalInfo || ''
            });
        }

        const result = this.result as ApiResult
        const resultSummary = result.getResultSummary()
        return this.res.send({
            success: resultSummary.success,
            result: resultSummary.result
        })
    }

    public sendAuth() {
        if (this.isError) {
            const err = (this.error as ApiError).getErrorSummary()
            return this.res.status(err.code).send({
                success: this.success,
                error: err.publicMessage || err.message,
                additionalInfo: err.additionalInfo || ''
            });
        }

        return this.res.send({
            success: true,
            result: this.auth
        })
    }

    public async track() {
        const traceMetaData: ITrackerMetadata = {
            requestType: this.requestType,
            inputs: this.params,
            router: this.router,
            // auth: {
            //     requireAuthHeader: this.requiredAuthHeader,
            //     header: this.auth,
            // },
            // security: {
            //     usingProxy: this.usingProxy,
            //     usingNativeCORS: this.usingNativeCORS,
            //     usingHostListFiltering: this.requireHostListFiltering,
            //     checks: {
            //         allowedMethodPassed: this.allowedMethodPassed,
            //         securityCheckNativeCORSPassed: this.securityCheckNativeCORSPassed,

            //         securityCheckAllowedAppPassed: this.securityCheckAllowedAppPassed,
            //         securityCheckHostListFilteringPassed: this.securityCheckHostListFilteringPassed,

            //         securityCheckRequiredDefaultHeadersPased: this.securityCheckRequiredDefaultHeadersPased,
            //         securityCheckRequiredRouterParamsPased: this.securityCheckRequiredRouterParamsPased,
            //         securityCheckRequiredRouterHeadersPased: this.securityCheckRequiredRouterHeadersPased,
            //         securityCheckProxyPassed: this.securityCheckProxyPassed,
            //         securityCheckRequiredAuthHeadersPased: this.securityCheckRequiredAuthHeadersPased,
            //     }
            // },
            // request: {
            //     isTerminated: this.isTerminated,
            //     requestID: `${this.nowApiTimer.getDate()}_${Randomizer.RandomString(10)}`,
            //     is404: this.is404,
            //     startTime: this.nowApiTimer.getDate() as number,
            //     endTime: new ApiTimer().getDate() as number,
            //     url: this.url,
            //     headers: this.requestHeaders,
            //     method: this.method,
            //     params: { ...this.queryParams, ...this.bodyParams },
            //     isPublicAccess: !this.requiredAuthHeader,
            //     IP: this.requestIP,
            //     origin: this.origin
            // },
            // app: {
            //     appID: this.appID
            // },
            // controller: {
            //     controllerName: this.controller?.controllerName as string,
            //     controllerPath: this.controller?.controllerName as string,
            //     controllerVersion: this.controller?.controllerName as string,
            // },
            response: {
                code: 200
            }
        }

        // new trace
        const trace: ITracker = {
            success: this.success,
            metadata: traceMetaData
        }

        if (this.result?.isDispatched) {
            trace.metadata.result = {
                startTime: this.result.startTime,
                endTime: this.result.endTime,
                success: this.result.success,
            }
        }

        if (this.isError && this.error) {
            trace.isError = true

            const errSummary = this.error.getErrorSummary()
            trace.metadata.error = {
                name: errSummary.name,
                exception: errSummary.exception,
                message: errSummary.message,
                time: errSummary.time,
                additionalInfo: errSummary.additionalInfo
            }

            trace.metadata.response.code = errSummary.code
        }

        try {
            await MasterDatabase.createDocument(TrackerModel, trace)
        } catch (exception) {
            const myError: IApiError = {
                name: 'ERR_WHILE_TRACKING_RESPONSE',
                exception: exception,
            };

            ApiCommandConsole.showConsoleMessage(new ApiError(myError).getErrorSummary(), 3)
        }
    }
}
