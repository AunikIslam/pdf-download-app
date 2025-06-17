const express = require("express");
const cors = require('cors');
const path = require("path");

const environmentConfig = require('./config/environment-config');
const pharmaInvoiceRouters = require('./routes/pharma-invoice');
const endpoints = require('./config/endpoints');
const baseUrls = require('./config/base-urls');
const utilFunctions = require('./utils/util-functions')
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

const accessTokenValidator = async (req, res, next) => {
    try {
        await axios.get(utilFunctions.prepareApiUrl(endpoints.validate_token, baseUrls.f_auth), {
            headers: {
                Authorization: req.headers['authorization']
            }
        });
        next();
    }
    catch (error) {
        res.status(401);
    }
}

app.use('/pharma-invoice', accessTokenValidator, pharmaInvoiceRouters);

app.listen(environmentConfig.port, () => {
    console.log(`Server is running on port ${environmentConfig.port}`);
});
