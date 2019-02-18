const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'user-management'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/user-management-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'user-management'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/user-management-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'user-management'
    },
    port: process.env.PORT || 3000,
    db: 'postgres://localhost/user-management-production'
  }
};

module.exports = config[env];
