import { NextFunction, Request, Response } from "express";

import { ApiCommandConsole } from "../../ker/utils/console";
import { ApiResponse } from "../../api/core/response";

export const middlewareReleaseResponse = (async (req: Request, res: Response, next: NextFunction) => {
    // Instantiate a new response object
    let newResponse = res.locals.ApiResponse as ApiResponse

    newResponse.sendResponse()

    try{
        await newResponse.track()
    }catch(exception){
        ApiCommandConsole.showConsoleMessage('Error during tracking a request',3)
    }

})