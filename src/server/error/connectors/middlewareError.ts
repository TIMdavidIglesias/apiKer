// MODULES
import { NextFunction, Request, Response } from "express";

// API
import { ApiResponse } from "../../../api/core/response";

// ERROR
import { ApiError } from "../../../ker/core/error";
import { IApiError } from "../../../ker/models/error/types";

export const throwMiddlewareErr = (err: string, addInfo: string, res: Response, next: NextFunction) => {
    let newResponse = res.locals.ApiResponse as ApiResponse;
    const myError: IApiError = {
        name: err,
        additionalInfo: addInfo
    }

    newResponse.isTerminated = true
    return next(new ApiError(myError))
}