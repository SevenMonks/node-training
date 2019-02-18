const config = require('../../config/config'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize(config.db),
  db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
