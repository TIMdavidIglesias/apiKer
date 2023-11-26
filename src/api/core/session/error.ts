export default [
    {
        name: 'ERR_SECRET_API_AUTH_TOKEN_HEADER_MISSING',
        message: 'Missing secret token auth header',
        errorCode: 400,
    }, {
        name: 'ERR_BAD_SECRET_API_AUTH_TOKEN',
        message: 'Bad secret token',
        errorCode: 400,
    }, {
        name: 'ERR_GENERATING_NEW_AUTH',
        message: 'Internal error generating new auth token',
        errorCode: 500,
    }, {
        name: 'ERR_PUBLIC_API_AUTH_TOKEN_HEADER_MISSING',
        message: 'Bad secret token',
        errorCode: 400,
    }, {
        name: 'ERR_LOCATING_AUTH_TOKEN',
        message: 'Internal error retrieving the auth token',
        errorCode: 500,
    }
    , {
        name: 'ERR_BAD_PUBLIC_API_AUTH_TOKEN',
        message: 'Internal error retrieving the auth token',
        errorCode: 400,
    }, {
        name: 'ERR_EXPIRED_PUBLIC_API_AUTH_TOKEN',
        message: 'Internal error retrieving the auth token',
        errorCode: 400,
    }
];
