const Sequelize = require('sequelize');
const environmentConfig = require('../config/environment-config');

const sequelize = new Sequelize(
    environmentConfig.dbName,
    environmentConfig.dbUser,
    environmentConfig.dbPassword,
    {
        host: environmentConfig.dbHost,
        dialect: 'postgres',
        port: environmentConfig.dbPort,
    }
);

module.exports = sequelize;