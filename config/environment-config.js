const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
    path: path.resolve(__dirname, `../environments/.env.${process.env.NODE_ENV}`)
});

module.exports = {
    port: process.env.PORT,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbPassword: process.env.DB_PASSWORD,
    dbUser: process.env.DB_USER,
    apiUrl: process.env.API_URL,
    nodeEnv: process.env.NODE_ENV,
    externalApiUrl: process.env.EXTERNAL_API_URL
};
