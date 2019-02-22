const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcrypt-nodejs'),
  config = require('../../../config/config'),
  genericErrorHandler = require('../../middlewares/response-handlers/generic-error-handler.middleware'),
  successResponseHandler = require('../../middlewares/response-handlers/success-response-handler.middleware');

router.post(
  '/encrypt-password',
  (request, response, next) => {
    let password = request.sanitize(request.body.password.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));

    try {
      password = bcrypt.hashSync(password);

      response.locals.responseStatus = config.app.http_status_codes.http_200_ok;
      response.locals.responseData = {
        status: 'success',
        type: 'EncryptedPassword',
        data: {
          password
        }
      };
      successResponseHandler(request, response, next);
    } catch (error) {
      response.locals.responseStatus = config.app.http_status_codes.http_500_internal_server_error;
      response.locals.responseData = {
        status: 'error',
        type: config.app.system_error,
        data: {
          message: "Couldn't encrypt password"
        }
      };
      genericErrorHandler(request, response);
    }
  }
);

module.exports = app => app.use('/', router);
