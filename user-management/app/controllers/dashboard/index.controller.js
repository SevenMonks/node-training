const express = require('express'),
  router = express.Router(),
  config = require('../../../config/config'),
  genericErrorHandler = require('../../middlewares/response-handlers/generic-error-handler'),
  successResponseHandler = require('../../middlewares/response-handlers/success-response-handler');

module.exports = (app) => {
  app.use('/', router);
};

router.get(
  '/',
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
