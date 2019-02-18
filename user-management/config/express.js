const express = require('express'),
  glob = require('glob'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  resourceNotFoundResponseHandler = require('../app/middlewares/response-handlers/404-response-handler'),
  genericErrorHandler = require('../app/middlewares/response-handlers/generic-error-handler');

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

  const controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use(resourceNotFoundResponseHandler);

  app.use(genericErrorHandler);

  return app;
};
