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
const endpoints = require('../config/endpoints');

/** prepare url function test **/

describe('prepare Url', () => {
    it('should correctly prepare API URL', () => {
        const endpoint = '/validate-token';
        const baseUrl = 'f-auth';
        const result = utilFunctions.prepareApiUrl(endpoint, baseUrl);
        expect(result).toBe('https://f1gw.dev.bizmotionapp.com/f-auth/validate-token');
    });
});

/** parse params function test **/

describe('parse params', () => {
    it('should parse params properly', () => {
        const params = {
            marketFilter: '[]',
            distributorId: '0',
            retailerId: '0',
            fromDate: '2025-05-01',
            toDate: '2025-05-10',
            organizationId: '0',
            userId: '0',
            status: 'string'
        }
        const result = utilFunctions.parseParams(params);
        expect(result).toEqual({
            marketFilter: [],
            distributorId: 0,
            retailerId: 0,
            fromDate: '2025-05-01',
            toDate: '2025-05-10',
            organizationId: 0,
            userId: 0,
            status: null
        })
    });
})

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