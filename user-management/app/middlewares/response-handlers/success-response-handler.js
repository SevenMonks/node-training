const config = require('../../../config/config');

const successResponseHandler = (request, response, next) => {
  const responseStatus = (response.locals.responseStatus) ? response.locals.responseStatus : null,
    responseData = (response.locals.responseData) ? response.locals.responseData : null;

  if ((!responseStatus) || (!responseData)) {
    next();
  } else {
    response.status(responseStatus);
    response.json(responseData);
  }
};

module.exports = successResponseHandler;
