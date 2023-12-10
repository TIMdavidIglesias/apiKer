import { IAppsCache } from "../../src/api/models/apps/types";

export const _apps: IAppsCache[] = [
    {
        blackListedHosts:['0.0.0.0'],
        whiteListedHosts:['0.0.0.0'],
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

        // app admin email
        adminEmail: 'applicationEmail@test.com',
    },
]