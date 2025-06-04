const environmentConfig = require('../config/environment-config');

exports.prepareApiUrl = (api, baseUrl) => {
    return environmentConfig.externalApiUrl + baseUrl + api;
}
