// modules
import cors from 'cors'

// CORE
import { Cache } from '../../ker/core/cache'
import { appGetAppsAllowedOrigins } from '../../api/core/apps'

/**
 * Configures and returns a CORS (Cross-Origin Resource Sharing) middleware for Express.
 * 
 * @returns The CORS middleware configured with allowed origins, credentials, and other options.
 */
export const setCors = () => {
    // Get the allowed origins from the registered apps
    const allowedOrigins = appGetAppsAllowedOrigins() as string[];

    // Configure and return the CORS middleware
    return cors({
        credentials: true, // Include credentials in the CORS request (e.g., cookies, HTTP authentication)
        origin: allowedOrigins, // Specify allowed origins
        optionsSuccessStatus: 204, // Set the status code for successful preflight requests
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Accept',
            Cache._vars.security.kerLockerSecretAuthHeaderName,
            Cache._vars.security.kerLockerPublicAuthHeaderName,
            Cache._vars.security.kerLockerCSRFHeaderName], // Specify allowed headers
        exposedHeaders: [Cache._vars.security.kerLockerCSRFHeaderName], // Specify exposed headers if needed
    });
}
