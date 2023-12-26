// modules
import { NextFunction, Request, Response } from "express";

// API
import { ApiResult } from "../result";
import { ApiResponse } from "../response";
// - types
import { IRouterController } from "../../models/router/types";

// CORE
import { Cache } from "../../../ker/core/cache";
import { DefaultArgs } from "./args";

// ERROR
import { IApiError } from "../../../ker/models/error/types";
import { ApiError } from "../../../ker/core/error";

// loads and handles the controller
export class ApiController {
    private controllerPath: string;
    private controllerName: string;
    private controllerVersion: string;
    private controllerFilePath: string;

    public requestStorage: { [k: string]: any }

    public result: ApiResult
    private newResponse: ApiResponse

    // private result: ApiResult

    constructor(newResponse: ApiResponse) {
        this.newResponse = newResponse

        // controller
        const controller = newResponse.router.controller as IRouterController
        this.controllerPath = controller.controllerPath;
        this.controllerName = controller.controllerName;
        this.controllerVersion = controller.controllerVersion;
        this.requestStorage = {}

        const controllerDirectory = Cache._env.controllerDirectory
        this.controllerFilePath = controllerDirectory +
            this.controllerPath +
            '/' + this.controllerVersion +
            '/' + this.controllerName

        // initialize a new result for the controller
        this.result = new ApiResult()
    }

    public async execute(req: Request, res: Response, next: NextFunction) {
        // compile the dynamic model to execute
        const module = await this.compileDynamicController(this.controllerFilePath)

        // generate the args as utils for the module development
        // generates a new result able to be managed by the response
        const args = new DefaultArgs(this.result, this.requestStorage, this.newResponse.params, req, res, next)

        try {
            // tracking purposes: the execution time gets recorded
            this.result.setStartTime()
            await module(args.args)
            this.result.setEndTime()

            if (!this.result.isDispatched) {
                const myError: IApiError = {
                    name: 'ERR_RESULT_NOT_DISPATCHED',
                    additionalInfo: `Requested controller: ${this.controllerName}/${this.controllerVersion}`
                }

                throw new ApiError(myError)
            }
            return
        } catch (exception) {
            throw exception
        }
    }

    // compiles the controller and gets the module ready for execution
    public async compileDynamicController(controllerFilePath: string, checkpointControllerName: string|undefined=undefined): Promise<(args?: any) => any> {
        try {
            // compiles the controller defined by user
            // /**
            //  * ERROR TEST - PASSED
            //  */
            // throw 'TEST ERROR'

            const moduleToExcute = await import(controllerFilePath)
            return moduleToExcute[checkpointControllerName || this.controllerName]
        } catch (exception) {
            const myError: IApiError = {
                name: 'ERR_WHILE_LOADING_CONTROLLER',
                additionalInfo: `Requested controller: ${this.controllerName}/${this.controllerVersion}`,
                exception: exception,
            }

            throw new ApiError(myError)
        }
    }
}