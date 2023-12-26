// ERROR
import { ApiError } from "../../../ker/core/error"

// UTILS
import { ApiTimer } from "../../../ker/utils/timer"

export class ApiResult {
    public isDispatched: boolean
    public result: any
    public success: boolean
    public error?: ApiError

    public customErrorDefinitions: { name: string, code: number, message: string, publicMessage: string, additionalInfo: string }[]

    public startTime: number
    public endTime: number

    constructor() {
        this.success = false
        this.isDispatched = false
        this.startTime = 0
        this.endTime = 0
        this.customErrorDefinitions = []
    }

    public setStartTime() {
        this.startTime = new ApiTimer().getDate() as number
    }

    public setEndTime() {
        this.endTime = new ApiTimer().getDate() as number
    }

    public setSuccess(success: boolean = true) {
        this.success = success
    }

    public setError(error: ApiError) {
        this.error = error
    }

    public getResultSummary() {
        return {
            result: this.success ? this.result : this.error,
            success: this.success,
        }
    }

    public dispatch(result: any) {
        this.isDispatched = true
        if (result instanceof ApiError) {
            this.success = false
            this.error = result
        } else {
            this.success = true
            this.result = result
        }
    }
}