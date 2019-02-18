const express = require('express'),
  router = express.Router(),
  config = require('../../config/config');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (request, response, next) => {
  response.status(config.app.http_status_codes.http_200_ok);
  response.json({
    status: 'success',
    type: 'UserManagementDashboard',
    data: {}
  });
});
