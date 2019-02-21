const express = require('express'),
  router = express.Router(),
  path = require('path'),
  fs = require('fs'),
  multer = require('multer'),
  bcrypt = require('bcrypt-nodejs'),
  config = require('../../../config/config'),
  profileModel = require('../../models/profile/index.pgsql.model'),
  jwtAuthenticationHandler = require('../../middlewares/authentication/jwt-authentication-handler.middleware'),
  genericErrorHandler = require('../../middlewares/response-handlers/generic-error-handler.middleware'),
  successResponseHandler = require('../../middlewares/response-handlers/success-response-handler.middleware');

const fileStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    const storagePath = path.resolve('./', 'uploads', 'profile-images');

    if (!fs.existsSync(storagePath)) {
      fs.mkdir(
        storagePath,
        {
          recursive: true,
          mode: 0o755
        },
        error => {
          callback(error, storagePath);
        }
      );
    } else {
      callback(null, storagePath);
    }
  },
  filename: (request, file, callback) => {
    const fileExtension = file.originalname.substring((file.originalname.lastIndexOf('.') + 1));
    callback(null, `user-profile-image-${(request.body.id) ? request.body.id + '-' : ''}${new Date().getTime()}.${fileExtension}`);
  }
});

const fileUploader = multer({
  storage: fileStorage,
  fileFilter: (request, file, callback) => {
    if (-1 === ['image/jpeg', 'image/png'].indexOf(file.mimetype)) {
      callback(new Error(`Mime type ${file.mimetype} is not supported`), false);
    } else {
      callback(null, true);
    }
  }
}).single('profileImage');

router.put(
  '/profile',
  jwtAuthenticationHandler,
  (request, response, next) => {
    fileUploader(request, response, error => {
      if (error) {
        response.locals.responseStatus = config.app.http_status_codes.http_500_internal_server_error;
        response.locals.responseData = {
          status: 'error',
          type: config.app.rest_error_codes.system_error,
          data: {
            message: 'Failed to uplaod profile image'
          }
        };
        genericErrorHandler(request, response);
      } else {
        let id = +request.body.id,
          username = request.sanitize(request.body.username.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
          password = request.sanitize(request.body.password.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
          firstName = request.sanitize(request.body.firstName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
          midName = (request.body.midName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) ? request.sanitize(request.body.midName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) : null,
          lastName = request.sanitize(request.body.lastName.replace(/^\s\s*/, '').replace(/\s\s*$/, '')),
          sex = (request.body.sex.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) ? request.sanitize(request.body.sex.replace(/^\s\s*/, '').replace(/\s\s*$/, '')) : null,
          age = (request.body.age.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '')) ? +request.sanitize(request.body.age.toString().replace(/^\s\s*/, '').replace(/\s\s*$/, '')) : null,
          profileImage = request.file.filename;

        password = bcrypt.hashSync(password);

        profileModel.updateProfile(id, username, password, firstName, midName, lastName, sex, age, profileImage)
          .then(result => {
            response.locals.responseStatus = config.app.http_status_codes.http_200_ok;
            response.locals.responseData = {
              status: 'success',
              type: 'ProfileUpdate',
              data: {
                id
              }
            };
            successResponseHandler(request, response, next);
          })
          .catch(
            error => {
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
          );
      }
    });
  }
);

module.exports = app => app.use('/', router);
