// modules
import cors from 'cors'

// CORE
import { Cache } from '../../ker/core/cache'
import { appGetAppsAllowedOrigins } from '../../api/core/apps'

export const setCors = () => {
    return cors({
        credentials: true,
        origin: appGetAppsAllowedOrigins(),
        optionsSuccessStatus: 204,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Accept',
            Cache._vars.security.kerLockerSecretAuthHeaderName,
            Cache._vars.security.kerLockerPublicAuthHeaderName,
            Cache._vars.security.kerLockerCSRFHeaderName],
        // exposedHeaders: [...Cache._vars.security.exposedHeaders || []],
    })
}