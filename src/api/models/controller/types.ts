import { Request } from "express"
import { IApiError } from "../error/types"

export interface IGSInput{
    alias: string,
    query?: string,
    criteria?: any,
    data?: any
}

export interface IFilterArgs {
    ENV: {
        // getLogDestination: () => any
    },
    ERROR: {
        defineNewError: (name: string, code: number, message: string, publicMessage: string, additionalInfo: string) => void,
        throwError: (errorName: string) => void
    },
    RESULT: {
        dispatch: (result?: IApiError | string,
            message?: string,
            code?: number) => void,
        // setResult: (result: any) => void,
        success: () => void,
    },
    GDOCS: {
        create: (input: IGSInput) => Promise<any>,
        read: (input: IGSInput) => Promise<any>
        update: (input: IGSInput) => Promise<any>
    },
    REQUEST: {
        getParams: () => { [key: string]: string } | undefined
    },
    // SESSION: {
    //     startNewSession: (sessionParams: sessionParams) => any
    // },
    METADATA: {
        req: Request
    }
}