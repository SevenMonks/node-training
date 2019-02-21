const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcrypt-nodejs'),
  config = require('../../../config/config'),
  userModel = require('../../models/user/index.pgsql.model'),
  jwtAuthenticationService = require('../../services/authentication/jwt-authenticator.service'),
  genericErrorHandler = require('../../middlewares/response-handlers/generic-error-handler.middleware'),
  successResponseHandler = require('../../middlewares/response-handlers/success-response-handler.middleware');

router.post(
  '/login',
  async (request, response, next) => {
    try {
      let username = request.sanitize(request.body.username.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
        password = request.sanitize(request.body.password.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));

      try {
        const user = await userModel.fetchUserByUsername(username);

        try {
          if (0 === user.length) {
            response.locals.responseStatus = config.app.http_status_codes.http_400_bad_request;
            response.locals.responseData = {
              status: 'error',
              type: config.app.rest_error_codes.invalid_argument,
              data: {
                message: 'Invalid username provided'
              }
            };
            genericErrorHandler(request, response);
          } else {
            if (!bcrypt.compareSync(password, user[0].password)) {
              response.locals.responseStatus = config.app.http_status_codes.http_400_bad_request;
              response.locals.responseData = {
                status: 'error',
                type: config.app.rest_error_codes.object_not_found,
                data: {
                  message: 'Invalid password provided'
                }
              };
              genericErrorHandler(request, response);
            } else {
              const currentTime = Math.floor(Date.now() / 1000);

              const token = jwtAuthenticationService.createJwt({
                sub: user[0].id,
                username: user[0].username,
                userFirstName: user[0].first_name,
                userLastName: user[0].last_name,
                iss: process.env.JWT_ISSUER,
                aud: process.env.JWT_AUDIENCE,
                iat: currentTime,
                exp: (currentTime + parseInt(process.env.JWT_EXPIRATION)),
                refreshTill: (currentTime + parseInt(process.env.JWT_REFRESH_EXPIRATION))
              });

              response.locals.token = token;
              response.locals.responseStatus = config.app.http_status_codes.http_200_ok;
              response.locals.responseData = {
                status: 'success',
                type: 'UserLogin',
                data: null
              };
              successResponseHandler(request, response, next);
            }
          }
        } catch (error) {
          response.locals.responseStatus = config.app.http_status_codes.http_500_internal_server_error;
          response.locals.responseData = {
            status: 'error',
            type: config.app.rest_error_codes.system_error,
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
    } catch (error) {
      response.locals.responseStatus = config.app.http_status_codes.http_500_internal_server_error;
      response.locals.responseData = {
        status: 'error',
        type: config.app.rest_error_codes.system_error,
        data: {
          message: (('development' === process.env.APP_RUNTIME_ENV) ? error.message : 'An internal server error occurred')
        }
      };
      genericErrorHandler(request, response);
    }
  }
);

module.exports = app => app.use('/', router);
