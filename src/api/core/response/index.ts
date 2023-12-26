// modules
import { Response } from "express";

// CORE
import { MasterDatabase } from "../../../ker/core/databases/master";

// - utils
import { ApiTimer } from "../../../ker/utils/timer";
import { ApiCommandConsole } from "../../../ker/utils/console";

// API
import { ApiResult } from "../result";

// - types
import { IAppsCache } from "../../models/apps/types";
import { IRouterCache, IRouterController } from "../../models/router/types";


// ERROR
import { ApiError } from "../../../ker/core/error";
import { IApiError } from "../../../ker/models/error/types";
import { ApiSession } from "../session";
import { IKerLockerTempAuth } from "../../models/auth/types";
import { ITracker, ITrackerMetadata } from "../../../ker/models/tracker/types";
import { TrackerModel } from "../../../ker/models/tracker/model";

export class ApiResponse {
    // proxy
    public proxyFlag: string

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

        requireAuth: boolean
        requireSession: boolean
        requiredIPFilter: boolean
    }

    // APP
    public appID: string | undefined
    public app: IAppsCache | undefined

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

    // securityChecks
    public allowedMethodPassed: boolean
    public securityCheckProxyPassed: boolean
    public securityCheckRouterIsActive: boolean
    public securityCheckAuthToken: boolean
    public securityCheckRequiredRouterParamsPassed: boolean

    public controllerExecutionSuccess: boolean
    public sessionAlive: boolean

    public requestID: string

    constructor(res: Response, route: IRouterCache | undefined) {
        this.res = res
        this.proxyFlag = 'default'

        this.requestID = res.locals.requestID
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

        this.securityCheckProxyPassed = false

        this.requireHostListFiltering = false
        this.allowedMethodPassed = true
        this.securityCheckRouterIsActive = false
        this.securityCheckAuthToken = false
        this.securityCheckRequiredRouterParamsPassed = false
        this.controllerExecutionSuccess = true

        this.sessionAlive = false

        res.locals.ApiResponse = this

        this.result = undefined
    }

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

    public async track(success: boolean | undefined = undefined) {
        const traceMetaData: ITrackerMetadata = {
            requestType: this.requestType,
            proxyFlag: this.proxyFlag,
            inputs: this.params,
            router: this.router,
            response: {
                code: 200
            }
        }

        if(this.requestType==='api'){
            traceMetaData.securityChecks= {
                securityCheckProxyPassed: this.securityCheckProxyPassed,
                sessionAlive: this.securityCheckProxyPassed,
                allowedMethodPassed: this.allowedMethodPassed,
                securityCheckRouterIsActive: this.securityCheckRouterIsActive,
                securityCheckAuthToken: this.securityCheckAuthToken,
                securityCheckRequiredRouterParamsPassed: this.securityCheckRequiredRouterParamsPassed,
                controllerExecutionSuccess: this.controllerExecutionSuccess
            }
        }

        // new trace
        const trace: ITracker = {
            success: success || this.success,
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
