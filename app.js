const express = require("express");
const cors = require('cors');
const path = require("path");

const environmentConfig = require('./config/environment-config');
const endpoints = require('./config/endpoints');
const baseUrls = require('./config/base-urls');
const utilFunctions = require('./utils/util-functions')
const axios = require("axios");
const app = express();
const templateRoutes = require('./routes/template-routes');
const pdfExportRoutes = require('./routes/pdf-export-routes')
const BaseService = require('./services/base-service');
const setupSwagger = require('./config/swagger-config');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const isSwaggerRequest = async (req, res, next) => {
    res.locals.skipAuth = req.originalUrl.includes('swagger-ui');
    next();
}

const validateToken = async (req, res, next) => {
    if (res.locals.skipAuth) {
        next();
    }
    else {
        try {
            let token;
            if (req.headers.authorization) {
                token = req.headers.authorization;
            } else {
                token = `Bearer ${req.query.access_token}`;
            }
            BaseService.setToken(token)
            req.self = await BaseService.validateToken(utilFunctions.prepareApiUrl(endpoints.validate_token, baseUrls.f_auth));
            next();
        }
        catch (error) {
            console.log(`Error from token validate api: ${error.message}`);
            return res.status(401);
        }
    }

}

const getPermissions = async (req, res, next) => {
    if (res.locals.skipAuth) {
        next();
    } else {
        try {
            req.permissions = await BaseService.getPermissionSet(utilFunctions.prepareApiUrl(endpoints.self_authorities, baseUrls.f_base));
            next();
        } catch (error) {
            console.log(`Error from permission set api: ${error.message}`);
            return res.status(401);
        }
    }

}

 app.use('/', isSwaggerRequest, validateToken, getPermissions);

// app.use('/pdf-manager/templates', templateRoutes);
app.use('/pdf-manager/pdf-export', pdfExportRoutes);

setupSwagger(app);

app.listen(environmentConfig.port, () => {
    console.log(`Server is running on port ${environmentConfig.port}`);
});
