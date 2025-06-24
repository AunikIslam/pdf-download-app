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
const BaseService = require('./services/base-service');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const baseService = new BaseService();

app.use('/', async (req, res, next) => {
    try {
        const data = await axios.get(utilFunctions.prepareApiUrl(endpoints.validate_token,
            baseUrls.f_auth), {
            headers: {
                Authorization: req.headers['authorization']
            }
        });
        baseService.setToken(req.headers['authorization'])
        next();
    } catch (error) {
        res.status(401);
    }
});

app.use('/', async (req, res, next) => {
    try {
        req.permissions = await baseService.getPermissionSet(utilFunctions.prepareApiUrl(endpoints.self_authorities, baseUrls.f_base));
        next();
    } catch (error) {
        console.log(error.message);
    }
});

app.use('/api/v1/pdf-generation', templateRoutes);

app.listen(environmentConfig.port, () => {
    console.log(`Server is running on port ${environmentConfig.port}`);
});
