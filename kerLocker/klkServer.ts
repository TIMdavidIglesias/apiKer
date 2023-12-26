import { kLKServerArgs } from "./types";

export const klkServer:kLKServerArgs = {
    // Port on which the Express app will listen
    port: 6000,

    // Hostname for the Express app
    hostName: 'localhost',

    // URL of the kerLocker server for authentication
    kerLockerURL: 'https://api.heptacore.org',

    // Route for the authentication endpoint
    authRoute: '/auth/authorize',

    // Header name for the secret token used in authentication requests
    secretTokenHeaderName: 'api-secret',

    // Secret token used for authentication with kerLocker
    secretToken: 'xAkdKkKYF3xsWCsZRiGCZTfTFeVxq1MO8yP4ojWjHZVAr7TtArae8FPTgkwEdATD',

    // Refresh interval for obtaining a new authentication token (in minutes)
    refreshMins: 10,

    // Allowed origin for CORS (Cross-Origin Resource Sharing)
    allowedOrigin: 'https://timdevelopers.com'
}
