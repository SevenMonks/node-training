const express = require('express');
const glob = require('glob');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');

module.exports = (app, config) => {
  const env = process.env.APP_RUNTIME_ENV;
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == process.env.APP_RUNTIME_ENV;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(compress());
  app.use(methodOverride());

  const controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((request, response, next) => {
    let error = new Error('Requested resource was not found.');
    error.status = config.app.http_status_codes.http_404_not_found;
    next(error);
  });

  app.use((error, request, response, next) => {
    response.status(error.status || config.app.http_status_codes.http_500_internal_server_error);
    response.json({
      status: 'error',
      type: ((config.app.http_status_codes.http_404_not_found === error.status) ? config.app.rest_error_codes.object_not_found : config.app.rest_error_codes.system_error),
      message: ((config.app.http_status_codes.http_404_not_found === error.status) ? error.message : 'Internal server error.'),
      error: (app.locals.ENV_DEVELOPMENT) ? ((config.app.http_status_codes.http_404_not_found === error.status) ? error : new Error('Internal server error.')) : {}
    });
  });

  return app;
};
