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
const templateRoutes = require('./routes/template-routes');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', async (req, res, next) => {
    try {
        const data = await axios.get(utilFunctions.prepareApiUrl(endpoints.validate_token, baseUrls.f_auth), {
            headers: {
                Authorization: req.headers['authorization']
            }
        });
        console.log(data);
        next();
    }
    catch (error) {
        res.status(401);
    }
});

app.use('/api/v1/pdf-generation', templateRoutes);

app.listen(environmentConfig.port, () => {
    console.log(`Server is running on port ${environmentConfig.port}`);
});
