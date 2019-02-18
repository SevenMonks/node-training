const express = require('express'),
  router = express.Router(),
  config = require('../../../config/config'),
  dashboardModel = require('../../models/dashboard/index'),
  genericErrorHandler = require('../../middlewares/response-handlers/generic-error-handler'),
  successResponseHandler = require('../../middlewares/response-handlers/success-response-handler');

module.exports = (app) => {
  app.use('/', router);
};

router.get(
  '/',
  async (request, response, next) => {
    try {
      let users = await dashboardModel.fetchUsers();

      response.locals.responseStatus = config.app.http_status_codes.http_200_ok;
      response.locals.responseData = {
        status: 'success',
        type: 'UserList',
        data: {
          users
        }
      };
      successResponseHandler(request, response, next);
    } catch (error) {
      response.locals.responseStatus = config.app.http_status_codes.http_500_internal_server_error;
      response.locals.responseData = {
        status: 'error',
        type: (('development' === process.env.APP_RUNTIME_ENV) ? config.app.database_error_codes.err_level_query_exec : config.app.rest_error_codes.system_error),
        data: {
          message: (('development' === process.env.APP_RUNTIME_ENV) ? error.original.message : 'An internal server error occurred')
        }
      };
      genericErrorHandler(request, response);
    }
  }
);
