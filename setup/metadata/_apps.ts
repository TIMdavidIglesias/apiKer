import { IAppsCache } from "../../src/api/models/apps/types";

export const _apps: IAppsCache[] = [
    {
        blackListedHosts:['185.100.87.192'],
        useHostListFilter: true,
        hostListPriority : 'blackList',

        // name of the app
        appName: 'defaultTest',

        // if apps are meant to work as a team/group it can be assigned
        group: 'dev',

        // SwaggerDocs will access to the default api. Also no CORS requests
        // will require a default app
        isDefault: true,

        // allowedOrigin for the requests coming to the default app
        allowedOrigin: 'https://timdevelopers.com',
        // virtualServer: {
        //     ports: [
        //         3000,
        //         3001
        //     ],
        //     livesessionExpirySecs: 600
        // },

        authorization:{
            secretToken: '7Nk2hDwR8sUvF1jXqO3lYpZ3AqN4jF5kT1iJrM7lC6zS4dA8kGhU6lC4kV3aL9x',
        },

        // app admin email
        adminEmail: 'applicationEmail@test.com',
        
        // token meant to sign the sessionToken and security refs
        applicationSecretToken: '1b7c3b5f7c2d9e5a6f8c7b9e4d8c3a2f1b7c3b5f7c2d9e5a6f8c7b9e4d8c3a2f1b7c3b5f7c2d9e5a6f8c7b9e4d8c3a2f',

        // encryption key for encryption of sensible data
        encryptionKey: '4F1A8B7C3D6E5F0A',

        // refresh token meant to sign the sessionToken and security refs
        applicationSecretTokenRefresh: '1b7c3b5f7c2d9e5a6f8c7b9e4d8c3a2f1b7c3b5f7c2d9e5a6f8c7b9e4d8c3a2f1b7c3b5f7c2d9e5a6f8c7b9e4d8c3a2f',
        
        config: {
            session: {
                // custom name for the session header/cookie
                sessionTokenName: 'sessionToken',

                // custom name for CSRF token headers
                CSRFTokenHeaderName: 'CSRF',

                // custom name for the fingerprint header sent by the browser
                fingerPrintHeaderName: 'fingerprint',

                // 
                usingServerCheckpoint: true,
                
                policy: {
                    onExpiredToken: 'requireNewLogin',

                    // allows a session to remain active within the client browser
                    rememberSession: {

                        allow: true,
                        // defines the max allowed time
                        hoursTimeOut: 1,

                        // defined the link of the target param within the request. 
                        // Used mainly when login new session
                        param: {
                            // name of the target param within the request
                             name: 'remember', 

                             // location where the param gets available
                             // body | header | query 
                             location: 'body'
                             }
                    },
                    
                    // sessionToken expiration minutes
                    timeOutMinutes: 10,

                    // useful in environments where the usage of cookies is too restricted.
                    // Allows one user to start a new session through an app using strictly
                    // headers and discarding cookies as storage
                },
                checkPointController: {
                    controllerName: 'SessionCheckpoint',
                    controllerPath: 'session',
                    controllerVersion: '1000',
                },

            },
            signup: {
                accountTypeDefaultID: 0,
                accountTypes: [
                    {
                        accountTypeId: 0,
                        name: 'userAccount'
                    }
                ],
                maxPermission: 3
            }
        }
    },
]