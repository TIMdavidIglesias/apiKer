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
import { KerLocker } from "../auth/kerLocker";
import { boolean } from "yup";
import { ApiResponse } from ".";


// import { ITracker, ITrackerMetadata } from "../../models/tracker/types";

// import { KerLocker } from "../../auth/kerLocker";
// import { TrackerModel } from "../../models/tracker/model";

export class ControllerResponse extends ApiResponse{
    constructor() {

    }

    public sendResponse(res: Response) {
        if (this.isError) {
            const err = (this.error as ApiError).getErrorSummary()
            return res.status(err.code).send({
                success: this.success,
                error: err.publicMessage || err.message,
                additionalInfo: err.additionalInfo || ''
            });
        }

        const result = this.result as ApiResult
        const resultSummary = result.getResultSummary()
        return res.send({
            success: resultSummary.success,
            result: resultSummary.result
        })
    }

}
