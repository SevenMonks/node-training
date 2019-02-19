const express = require('express'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  sanitizer = require('express-sanitizer'),
  glob = require('glob'),
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
  app.use(sanitizer());

  const controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use(resourceNotFoundResponseHandler);

  app.use(genericErrorHandler);

  return app;
};
