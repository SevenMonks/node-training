const config = require('../../../config/config');

const resourceNotFoundResponseHandler = (request, response) => {
  response.status(config.app.http_status_codes.http_404_not_found);
  response.json({
    status: 'error',
    type: config.app.rest_error_codes.object_not_found,
    data: {
      message: 'Requested resource was not found'
    }
  });
};

module.exports = resourceNotFoundResponseHandler;
