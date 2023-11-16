export interface IRouterCache {
    route: string,
    controllers: IRouterControllersAllowed,
    CORS?: boolean,
    CSRF?: boolean,
    requireAuth?: boolean,
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
    controllerPath: string,
    controllerVersion: string,
    CORS?: boolean,
    CSRF?: boolean,
    requireAuth?: boolean,
    requiredHeaders?: string[],
    requiredParams?: IRouterRequiredParams[],
    apiDoc?: IRouterApiDocs
}

export interface IRouterRequiredParams {
    name: string
    items?: any
    location: 'query' | 'body' | 'header' | 'cookie' | 'path'
    example?: string,
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
        description?: string,
        code: number,
        headers?: {
            AuthToken?: {
                description: string,
                schema:
                { type: string }
            }
        }
    } |
    {
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

export interface IRouterIgnoringCache {
    routerIgnoring?: string[]
}