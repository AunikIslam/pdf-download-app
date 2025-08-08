const axios = require("axios");
const sessionContextService = require('./session-context-service');

class BaseService {

    static getHeader() {
        return {
            Authorization: sessionContextService.getDataByKey('token')
        };
    }

    static getData(endpoint) {
        return axios.get(endpoint, {
            headers: this.getHeader(),
        })
    }

    static validateToken(endpoint) {
        return this.getData(endpoint)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw new Error(`${error.message}`);
            })
    }

    static getPermissionSet(endpoint) {
        return this.getData(endpoint)
            .then(response => {
                return response.data.data.content;
            })
            .catch(error => {
                throw new Error(`${error.message}`);
            })
    }

    static getSecondaryOrderDetails(endpoint) {
        return this.getData(endpoint)
            .then(response => {
                return response.data.Data.SecondaryOrder;
            })
            .catch(error => {
                console.log(`Error from base service secondary order details api: ${error.message}`);
            });
    }
}

module.exports = BaseService;
