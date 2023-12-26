export interface IRouterCache {
    route: string,
    minPermissionLevel?: number,
    controllers: IRouterControllersAllowed,
    CORS?: boolean,
    CSRF?: boolean,
    requireAuth?: boolean,
    requireSession?: boolean,
    metadata: IRouterMetadata
}

export interface IRouterMetadata {
    label?: string,
    tag: string,
    routerID?: string,
    isActive?: boolean,
    creationDate?: Date,
    updatedDate?: Date | undefined,
}

export interface IRouterControllersAllowed {
    GET?: IRouterController;
    POST?: IRouterController;
    PUT?: IRouterController;
    DELETE?: IRouterController;
    HEAD?: IRouterController;
    OPTIONS?: IRouterController;
    PATCH?: IRouterController;
    CONNECT?: IRouterController;
    TRACE?: IRouterController;
    COPY?: IRouterController;
    LOCK?: IRouterController;
}

export interface IRouterController {
    controllerName: string,
    minPermissionLevel?: number
    controllerPath: string,
    requireAuth?: boolean,
    requireSession?: boolean,
    controllerVersion: string,
    CORS?: boolean,
    CSRF?: boolean,
    requiredParams?: IRouterRequiredParams[],
    apiDoc?: IRouterApiDocs
}

export interface IRouterRequiredParams {
    name: string
    enum?:any[],
    location: 'query' | 'body' | 'header' | 'cookie' | 'path'
    example?: string | boolean | number | object | Array<any>,
    validation: IRouterParamValidationProps,
}

export interface IRouterApiDocs {
    summary?: string,
    description?: string,
    operationId: string,
    importParamErrors?:boolean,
    requestBody?: {
        description?: string,
        content: string[],
    },
    responses:
    ({
        defType:'response',
        description?: string,
        code: number,
        headers?: any,
        content?: string[],
        params?: any,
    } |
    {
        defType:'error',
        description?: string,
        errorList: string[],
    })[]
}

export interface IRouterParamValidationProps {
    isEmail?: { val: boolean, error: string },
    isURL?: { val: boolean, error: string },
    isRequired?: { val: boolean, error: string },
    min?: { val: number, error: string },
    max?: { val: number, error: string },
    isInteger?: { val: boolean, error: string },
    isPositive?: { val: boolean, error: string },
    of?: { val: any, error: string },
    paramType?: { val: string, format?: string, items?: any, error: string },
}