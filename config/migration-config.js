const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
require('dotenv').config({
  path: path.resolve(__dirname, `../environments/.env.${process.env.NODE_ENV}`)
});

const config = {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": process.env.DB_PORT
}

module.exports = {
    [process.env.NODE_ENV]: config
}
