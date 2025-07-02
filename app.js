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

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        BaseService.setToken(token)
        req.self = await BaseService.getSelfInfo(utilFunctions.prepareApiUrl(endpoints.validate_token, baseUrls.f_auth))
        console.log(`Query 3 ${req.query.time}`);
        next();
    } catch (error) {
        return res.status(401);
    }
});

app.use('/', async (req, res, next) => {
    try {
        req.permissions = await BaseService.getPermissionSet(utilFunctions.prepareApiUrl(endpoints.self_authorities, baseUrls.f_base));
        next();
    } catch (error) {
        console.log(`Error from permission set api: ${error.message}`);
        return res.status(401);
    }
});

app.use('/api/v1/pdf-generation', templateRoutes);
app.use('/api/v1/pdf-export', pdfExportRoutes)

app.listen(environmentConfig.port, () => {
    console.log(`Server is running on port ${environmentConfig.port}`);
});
