process.env.EXTERNAL_API_URL = 'https://f1gw.dev.bizmotionapp.com/';
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

const utilFunctions = require('../utils/util-functions');
const baseService = require('../services/base-service');

/** prepare url function test **/

describe('utilFunctions', () => {
    it('should correctly prepare API URL', () => {
        const endpoint = '/validate-token';
        const baseUrl = 'f-auth';
        const result = utilFunctions.prepareApiUrl(endpoint, baseUrl);
        expect(result).toBe('https://f1gw.dev.bizmotionapp.com/f-auth/validate-token');
    });
});

/** validate token api test **/

describe('baseService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call validate token api with correct url', async () => {
        axios.get.mockResolvedValue({ data: { valid: true } });
        const endpoint = '/validate-token';
        const baseUrl = 'f-auth';
        const preparedUrl = utilFunctions.prepareApiUrl(endpoint, baseUrl);
        const result = await baseService.validateToken(preparedUrl);
        expect(axios.get).toHaveBeenCalledWith(preparedUrl, expect.any(Object));
        expect(result.valid).toBe(true);
    });
})