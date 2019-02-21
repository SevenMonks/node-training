const express = require('express'),
  router = express.Router(),
  config = require('../../../config/config'),
  jwtAuthenticationHandler = require('../../middlewares/authentication/jwt-authentication-handler.middleware'),
  successResponseHandler = require('../../middlewares/response-handlers/success-response-handler.middleware');

router.get(
  '/dashboard',
  jwtAuthenticationHandler,
  (request, response, next) => {
    response.locals.responseStatus = config.app.http_status_codes.http_200_ok;
    response.locals.responseData = {
      status: 'success',
      type: 'Dashboard',
      data: null
    };
    successResponseHandler(request, response, next);
  }
);

module.exports = app => app.use('/', router);
