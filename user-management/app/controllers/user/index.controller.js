const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcrypt-nodejs'),
  config = require('../../../config/config'),
  userModel = require('../../models/user/index.pgsql.model'),
  genericErrorHandler = require('../../middlewares/response-handlers/generic-error-handler'),
  successResponseHandler = require('../../middlewares/response-handlers/success-response-handler');

router.get(
  '/users',
  async (request, response, next) => {
    try {
      let users = await userModel.fetchUsers();

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

router.post(
  '/users',
  async (request, response, next) => {
    let username = request.sanitize(request.body.username.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
      password = request.sanitize(request.body.password.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
      firstName = request.sanitize(request.body.firstName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
      midName = (request.body.midName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) ? request.sanitize(request.body.midName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) : null,
      lastName = request.sanitize(request.body.lastName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
      sex = (request.body.sex.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) ? request.sanitize(request.body.sex.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) : null,
      age = (request.body.age.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '')) ? +request.sanitize(request.body.age.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '')) : null;

    password = bcrypt.hashSync(password);

    try {
      await userModel.addUser(username, password, firstName, midName, lastName, sex, age)[0];

      try {
        let result = await userModel.getLastInsertId();

        response.locals.responseStatus = config.app.http_status_codes.http_200_ok;
        response.locals.responseData = {
          status: 'success',
          type: 'AddNewUser',
          data: {
            id: result[0].currval
          }
        };
        successResponseHandler(request, response, next);
      } catch (error) {
        response.locals.responseStatus = config.app.http_status_codes.http_500_internal_server_error;
        response.locals.responseData = {
          status: 'error',
          type: (('development' === process.env.APP_RUNTIME_ENV) ? config.app.database_error_codes.err_level_query_exec : config.app.rest_error_codes.system_error),
          data: {
            message: (('development' === process.env.APP_RUNTIME_ENV) ? error.message : 'An internal server error occurred')
          }
        };
        genericErrorHandler(request, response);
      }
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

router.delete(
  '/users',
  async (request, response, next) => {
    let id = +request.body.id;

    try {
      let result = await userModel.fetchUserById(id);

      if (0 === result.length) {
        response.locals.responseStatus = config.app.http_status_codes.http_404_not_found;
        response.locals.responseData = {
          status: 'error',
          type: config.app.rest_error_codes.object_not_found,
          data: {
            message: `User with ID: ${id} doesn't exist in database`
          }
        };
        genericErrorHandler(request, response);
      } else {
        await userModel.deleteUser(id);

        response.locals.responseStatus = config.app.http_status_codes.http_200_ok;
        response.locals.responseData = {
          status: 'success',
          type: 'DeleteUser',
          data: null
        };
        successResponseHandler(request, response, next);
      }
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

module.exports = app => app.use('/', router);
