const axios = require("axios");

class BaseService {

    static token;

    static setToken(token) {
        this.token = token
    }

    static getToken() {
        return this.token
    }

    static getHeader() {
        return {
            Authorization: this.getToken(),
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
                console.log(``)
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
