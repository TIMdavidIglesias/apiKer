export interface kLKServerArgs {
    // Port on which the Express app will listen
    port: number;

    // Hostname for the Express app
    hostName: string;

    // URL of the kerLocker server for authentication
    kerLockerURL: string;

    // Route for the authentication endpoint
    authRoute: string;

    // Header name for the secret token used in authentication requests
    secretTokenHeaderName: string;

    // Secret token used for authentication with kerLocker
    secretToken: string;

    // Refresh interval for obtaining a new authentication token (in minutes)
    refreshMins: number;

    // Allowed origin for CORS (Cross-Origin Resource Sharing)
    allowedOrigin: string;
}