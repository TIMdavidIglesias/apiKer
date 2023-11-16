/**
 * Middleware for executing controller logic.
 * This function executes the controller logic for the API request and sends the response using the ApiResponse class.
 * If an API error is encountered, it sends an appropriate response using the ApiResponse class.
 */

// modules
import { NextFunction, Request, Response } from "express";

// CACHE
import { Cache } from "../../ker/core/cache";

// API
import { ApiResponse } from "../../api/core/response";
import { IApps } from "../../api/models/apps/types";
import { ApiController } from "../../api/core/controllers";
import { ApiTimer } from "../../ker/utils/timer";
import { throwMiddlewareErr } from "../error/connectors/middlewareError";

export const middlewareControllers = (async (req: Request, res: Response, next: NextFunction) => {
    // Instantiate a new response object
    let newResponse = res.locals.ApiResponse as ApiResponse

    try {
        const controller = new ApiController(newResponse)
        let controllerName
        const app = newResponse.app as IApps

        // sessionCheckpoint
        // if (app.config.session.usingServerCheckpoint === true && newResponse.requireAuth) {
        // if (newResponse.router.requireAuth) {
        //     const controllerPath = app.config.session.checkPointController.controllerPath;
        //     controllerName = app.config.session.checkPointController.controllerName;
        //     const controllerVersion = app.config.session.checkPointController.controllerVersion;

        //     const controllerDirectory = Cache._env.controllerDirectory
        //     const controllerFilePath = controllerDirectory + '_ker/'
        //         + controllerPath + '/' + controllerVersion + '/' + controllerName

        //     await controller._run(req, res, controllerFilePath, controllerName)
        // }


        // if(!.){
        //     const myError: IApiError = {
        //         name: 'ERR_FINGERPRINT_TOKEN_DOES_NOT_MATCH',
        //         additionalInfo: `Invalid fingerprint token`
        //     }

        //     throw new ApiError(myError)
        // }

        // this.g6Wrapper(collectionName)
        // const gs = new gSix()

        // try {
        //     return await gs.readRecord(input.alias, input.query || '', input.criteria)
        // } catch (exception) {
        //     return exception
        // }
        // }

        // controller execute at this point

        // continue session


        await controller.execute(req, res, next)

        // newResponse.auth && await newResponse.auth?.refreshSession(new ApiTimer())

        newResponse.result = controller.result
        newResponse.success = controller.result?.success || false
    } catch (exception) {
        return throwMiddlewareErr(exception as string, ``, res, next)

    }

    return next();
});