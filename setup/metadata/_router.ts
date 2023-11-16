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
        route: "/api/login",
        requireAuth: true,
        requireSession: false,
        CORS: false,
        controllers: {
            POST: {
                controllerName: 'Login',
                controllerPath: 'auth/login',
                controllerVersion: '1000',
                requiredParams: [
                    {
                        name: "password",
                        location: 'body',
                        example: 'passWord_1',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_PASSWORD' },
                            min: { val: 8, error: 'ERR_LOGIN_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_LOGIN_PASSWORD_LENGTH_HIGH' },
                        },
                    },
                    {
                        name: "email",
                        location: 'body',
                        example: 'mail@test.com',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_LOGIN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_LOGIN_MISSING_EMAIL' },
                            isEmail: { val: true, error: 'ERR_LOGIN_EMAIL_UNKNOWN_FORMAT' },
                        },
                    },
                    {
                        name: "remember",
                        example: 'false',
                        location: 'body',
                        validation: {
                            paramType: { val: 'boolean', error: 'ERR_LOGIN_REMEMBER_PARAM_BOOLEAN_MISMATCH' },
                            isRequired: { val: false, error: '' },
                        },
                    }
                ],
                apiDoc: {
                    summary: 'Login account',
                    description: 'Opens a new account session',
                    operationId: 'Login',
                    requestBody: {
                        description: 'Login data',
                        content: ['application/json'],
                    },
                    responses: [{
                        description: 'Success',
                        code: 200,
                    },
                    {
                        description: 'Input data error',
                        errorList: ['ERR_LOGIN_EMAIL_FAILED', 'ERR_LOGIN_PASSWORD_FAILED'],
                    }],
                },
            }
        }, metadata: {
            label: 'Login',
            tag: 'Login',
        }
    },
    {
        route: "/api/signup",
        requireSession: false,
        requireAuth: true,
        CORS: false,
        controllers: {
            POST: {
                controllerName: 'Signup',
                controllerPath: 'auth/signup',
                controllerVersion: '1000',
                // usingNativeCORS: true,
                requiredParams: [
                    {
                        name: "password",
                        location: 'body',
                        example: 'passWord_1',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_SIGNUP_PASSWORD_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_SIGNUP_MISSING_PASSWORD' },
                            min: { val: 8, error: 'ERR_SIGNUP_PASSWORD_LENGTH_LOW' },
                            max: { val: 50, error: 'ERR_SIGNUP_PASSWORD_LENGTH_HIGH' },
                        },
                    },
                    {
                        name: "email",
                        location: 'body',
                        example: 'mail@test.com',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_SIGNUP_EMAIL_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_SIGNUP_MISSING_EMAIL' },
                            isEmail: { val: true, error: 'ERR_SIGNUP_EMAIL_UNKNOWN_FORMAT' },
                        },
                    },
                    {
                        name: "firstName",
                        location: 'body',
                        example: 'ex@firstom',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_SIGNUP_FN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_SIGNUP_MISSING_FIRST_NAME' },
                            min: { val: 3, error: 'ERR_SIGNUP_FIRST_NAME_LENTH_LOW' },
                            max: { val: 50, error: 'ERR_SIGNUP_FIRST_NAME_LENGTH_HIGH' },
                        },
                    },
                    {
                        name: "lastName",
                        location: 'body',
                        example: 'ex@string',
                        validation: {
                            paramType: { val: 'string', error: 'ERR_SIGNUP_LN_PARAM_STRING_MISMATCH' },
                            isRequired: { val: true, error: 'ERR_SIGNUP_MISSING_LAST_NAME' },
                            min: { val: 3, error: 'ERR_SIGNUP_LAST_NAME_LENTH_LOW' },
                            max: { val: 50, error: 'ERR_SIGNUP_LAST_NAME_LENGTH_HIGH' },
                        },
                    }
                ],
                apiDoc: {
                    summary: 'Signup',
                    description: 'Signup',
                    operationId: 'Signup',
                    requestBody: {
                        description: 'Signup',
                        content: ['application/json'],
                    },
                    responses: [
                        {
                            description: 'Success',
                            code: 200,
                        },
                        {
                            errorList: ['ERR_SIGNUP_EMAIL_ALREADY_EXISTS', 'ERR_CREATING_NEW_USER',
                                'ERR_CREATING_NEW_ACCOUNT', 'ERR_CREATING_NEW_SESSION'],
                        }
                    ]
                },
            }
        }, metadata: {
            label: 'Signup',
            tag: 'Signup'
        },

    },
    {
        route: "/cfg/getDatabaseStatus",
        requireSession: true,
        requireAuth: false,
        CORS: true,
        minPermissionLevel: 4,
        controllers: {
            GET: {
                controllerName: 'GetDatabaseStatus',
                controllerPath: 'cfg/databases',
                controllerVersion: '1000',
                apiDoc: {
                    summary: 'GetDatabaseStatus',
                    description: 'Signup',
                    operationId: 'DbStatus',
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
            label: 'cfgGetDBStatus',
            tag: 'cfgGetDBStatus'
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
                    summary: 'GetDatabaseStatus',
                    description: 'Signup',
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
            label: 'cfgGetDBStatus',
            tag: 'cfgGetDBStatus'
        },

    },
]