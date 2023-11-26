import { IRouterCache } from "../../src/api/models/router/types"

export const _router: IRouterCache[] = [
    {
        route: "/auth/authorize",
        CORS: false,
        metadata: {
            label: 'AuthServer',
            tag: 'AuthServer'
        },
        controllers: {
            GET: {
                controllerName: 'None',
                controllerPath: 'None',
                controllerVersion: 'None',
                apiDoc: {
                    summary: 'Auth new session',
                    description: 'Get a new token to pass the auth checkpoint and open one session',
                    operationId: 'Auth',
                    responses: [{
                        description: 'Success',
                        code: 200,
                        content: ['application/json'],
                        params: [
                            {
                                name: "token",
                                paramType: { val: 'string' },
                            }, {
                                name: "date",
                                paramType: { val: 'string' },
                            },{
                                name: "appID",
                                paramType: { val: 'string' },
                            },{
                                name: "timeoutMins",
                                paramType: { val: 'integer',format: 'int64' },
                            },{
                                name: "origin",
                                paramType: { val: 'string' },
                            },
                        ]
                    },
                    {
                        description: 'Input data error',
                        errorList: ['ERR_LOGIN_EMAIL_FAILED', 'ERR_LOGIN_PASSWORD_FAILED'],
                    }],
                },
            }
        }
    },
    {
        route: "/tst/qVal1",
        requireSession: false,
        requireAuth: false,
        CORS: true,
        minPermissionLevel: 4,
        controllers: {
            GET: {
                controllerName: 'Tst1',
                controllerPath: 'tst',
                controllerVersion: '1000',
                requiredParams: [
                    {
                        name: "q1",
                        location: 'query',
                        example: 'q1',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                            min: { val: 8, error: 'ERR_LOGIN_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_LOGIN_PASSWORD_LENGTH_HIGH' },
                        },
                    },{
                        name: "q2",
                        location: 'query',
                        example:2,
                        validation: {
                            paramType: { val: 'integer', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                            min: { val: 8, error: 'ERR_LOGIN_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_LOGIN_PASSWORD_LENGTH_HIGH' },
                        },
                    },{
                        name: "q3",
                        location: 'query',
                        example:true,
                        validation: {
                            paramType: { val: 'boolean', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: false, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                            min: { val: 8, error: 'ERR_LOGIN_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_LOGIN_PASSWORD_LENGTH_HIGH' },
                        },
                    },{
                        name: "q4",
                        location: 'query',
                        // example:[2,23],
                        validation: {
                            paramType: { val: 'array', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            of: { val: 'integer', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                        },
                    },{
                        name: "q5",
                        location: 'query',
                        enum:[1, 2, 3],
                        // example:[2,23],
                        validation: {
                            paramType: { val: 'integer', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            of: { val: 'integer', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                        },
                    }],
                apiDoc: {
                    summary: 'Get all available database status',
                    description: 'Get the metadata for all available databases',
                    operationId: 'qVal1',
                    responses: [
                        {
                            description: 'Success',
                            code: 200,
                        },
                        {
                            errorList: ['ERR_SIGNUP_EMAIL_ALREADY_EXISTS'],
                        }
                    ]
                },
            }
        }, metadata: {
            label: 'Databases',
            tag: 'Databases'
        },

    },
    {
        route: "/tst/bVal1",
        requireSession: false,
        requireAuth: false,
        CORS: true,
        minPermissionLevel: 4,
        controllers: {
            GET: {
                controllerName: 'Tst1',
                controllerPath: 'tst',
                controllerVersion: '1000',
                requiredParams: [
                    {
                        name: "b1",
                        location: 'body',
                        example: 'b1k',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                            min: { val: 3, error: 'ERR_LOGIN_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_LOGIN_PASSWORD_LENGTH_HIGH' },
                        },
                    },{
                        name: "b2",
                        location: 'body',
                        example:2,
                        validation: {
                            paramType: { val: 'integer', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                            min: { val: 8, error: 'ERR_LOGIN_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_LOGIN_PASSWORD_LENGTH_HIGH' },
                        },
                    },{
                        name: "b3",
                        location: 'body',
                        example:true,
                        validation: {
                            paramType: { val: 'boolean', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: false, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                            min: { val: 8, error: 'ERR_LOGIN_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_LOGIN_PASSWORD_LENGTH_HIGH' },
                        },
                    },{
                        name: "q4",
                        location: 'query',
                        // example:[2,23],
                        validation: {
                            paramType: { val: 'array', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            of: { val: 'integer', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                        },
                    }],
                apiDoc: {
                    summary: 'Get all available database status',
                    description: 'Get the metadata for all available databases',
                    operationId: 'bVal1',
                    requestBody:{
                        description:'Test params route',
                        content:['application/json']
                    },
                    responses: [
                        {
                            description: 'Success',
                            code: 200,
                        },
                        {
                            errorList: ['ERR_SIGNUP_EMAIL_ALREADY_EXISTS'],
                        }
                    ]
                },
            }
        }, metadata: {
            label: 'Databases',
            tag: 'Databases'
        },

    },
    {
        route: "/cfg/getDatabaseStatus/{id}",
        requireSession: true,
        requireAuth: false,
        CORS: true,
        minPermissionLevel: 4,
        controllers: {
            GET: {
                controllerName: 'GetDatabaseStatus',
                controllerPath: 'cfg/databases',
                controllerVersion: '1000',
                // usingNativeCORS: true,
                requiredParams: [
                    {
                        name: 'id',
                        location: 'path',
                        example: '2',
                        validation: { isRequired: { val: false, error: '' } },
                    }
                ],
                apiDoc: {
                    summary: 'Get the available database status by id',
                    description: 'Get the metadata for the selected database',
                    operationId: 'DbStatusID',
                    responses: [
                        {
                            description: 'Success',
                            code: 200,
                            headers: {
                                AuthToken: {
                                    description: 'Auth token session',
                                    schema:
                                        { type: 'string' }
                                }
                            }
                        },
                        {
                            errorList: ['ERR_SIGNUP_EMAIL_ALREADY_EXISTS'],
                        }
                    ]
                },
            }
        }, metadata: {
            label: 'Databases',
            tag: 'Databases'
        },

    }, {
        route: "/cfg/createNewDatabase",
        requireSession: true,
        requireAuth: false,
        CORS: true,
        minPermissionLevel: 5,
        controllers: {
            GET: {
                controllerName: 'GetDatabaseStatus',
                controllerPath: 'cfg/databases',
                controllerVersion: '1000',
                // usingNativeCORS: true,
                requiredParams: [
                    {
                        name: 'id',
                        location: 'path',
                        example: '2',
                        validation: { isRequired: { val: false, error: '' } },
                    }
                ],
                apiDoc: {
                    summary: 'Get the available database status by id',
                    description: 'Get the metadata for the selected database',
                    operationId: 'DbStatusID',
                    responses: [
                        {
                            description: 'Success',
                            code: 200,
                            headers: {
                                AuthToken: {
                                    description: 'Auth token session',
                                    schema:
                                        { type: 'string' }
                                }
                            }
                        },
                        {
                            errorList: ['ERR_SIGNUP_EMAIL_ALREADY_EXISTS'],
                        }
                    ]
                },
            }
        }, metadata: {
            label: 'Databases',
            tag: 'Databases'
        },

    },
]