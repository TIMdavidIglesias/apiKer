export default [
  {
    name: 'ERR_NO_ORIGIN_HEADER_FOUND',
    message: 'Required origin header missing',
    errorCode: 400,
  }, {
    name: 'ERR_SECRET_API_TOKEN_HEADER_MISSING',
    message: 'Auth token missing',
    errorCode: 400,
  }, {
    name: 'BAD_SECRET_TOKEN',
    message: 'Secret token invalid',
    errorCode: 400,
  }, {
    name: 'ERR_NO_API_TOKEN_FOUND',
    message: 'Api token missing',
    errorCode: 400,
  }, {
    name: 'ERR_BAD_API_TOKEN',
    message: 'Bad api token',
    errorCode: 400,
  }
];
