const express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  passport = require('passport'),
  sanitizer = require('express-sanitizer'),
  glob = require('glob'),
  jwtAuthenticatorService = require('../app/services/authentication/jwt-authenticator.service'),
  resourceNotFoundResponseHandler = require('../app/middlewares/response-handlers/404-response-handler.middleware'),
  genericErrorHandler = require('../app/middlewares/response-handlers/generic-error-handler.middleware');

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
  passport.use(jwtAuthenticatorService.createAuthenticationStrategy());
  app.use(passport.initialize());

  const controllers = glob.sync(config.root + '/app/controllers/**/*.js');
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use(resourceNotFoundResponseHandler);

  app.use(genericErrorHandler);

  return app;
};
