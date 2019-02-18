const config = require('../../../config/config');

const genericErrorHandler = (request, response) => {
  const responseStatus = (response.locals.responseStatus) ? response.locals.responseStatus : config.app.http_status_codes.http_500_internal_server_error,
    responseData = (response.locals.responseData) ? response.locals.responseData : {
      status: 'error',
      type: config.app.rest_error_codes.system_error,
      data: {
        message: 'An internal server error occurred.'
      }
    };

  if (response.locals.responseStatus) {
    delete response.locals.responseStatus;
  }

  if (response.locals.responseData) {
    delete response.locals.responseData;
  }

  response.status(responseStatus);
  response.json(responseData);
};

module.exports = genericErrorHandler;
