const axios = require("axios");
const express = require("express");

const app = express();

class BaseService {

    setToken(token) {
        this.token = token
    }

    getToken() {
        return this.token
    }

    getHeader() {
        return {
            Authorization: this.getToken(),
        };
    }

    getData(endpoint) {
        return axios.get(endpoint, {
            headers: this.getHeader(),
        })
    }

    getPermissionSet(endpoint) {
        return this.getData(endpoint).then(response => {
            return response.data.data.content;
        })
    }
}

module.exports = BaseService;
