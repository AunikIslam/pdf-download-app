const utilFunctions = require('../utils/util-functions');
const axios = require('axios');
jest.mock('axios');
jest.mock('../services/session-context-service', () => {
    const store = {};
    return {
        initialize: jest.fn((data, cb) => cb()),
        setToken: jest.fn((token) => store.token = token),
        getToken: jest.fn(() => store.token)
    }

})


const baseService = require('../services/base-service');
const endpoints = require('../config/endpoints');



/** validate token api test **/

describe('validate token', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call validate token api with correct url', async () => {
        axios.get.mockResolvedValue(
            {
                data: true
            });
        const endpoint = 'api/v1/auth/validate-token';
        const baseUrl = 'f-auth/';
        const preparedUrl = utilFunctions.prepareApiUrl(endpoint, baseUrl);
        const result = await baseService.validateToken(preparedUrl);
        expect(axios.get).toHaveBeenCalledWith(preparedUrl, expect.any(Object));
        expect(result).toBe(true);
    });
});

/** permission api test **/

describe('get permission', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call permission api with correct url', async () => {
        axios.get.mockResolvedValue(
            {
                data: {
                    data: {
                        content: true
                    }
                }
            });
        const endpoint = endpoints.self_authorities;
        const baseUrl = 'f-auth/';
        const preparedUrl = utilFunctions.prepareApiUrl(endpoint, baseUrl);
        const result = await baseService.getPermissionSet(preparedUrl);
        expect(axios.get).toHaveBeenCalledWith(preparedUrl, expect.any(Object));
        expect(result).toBe(true);
    });
});