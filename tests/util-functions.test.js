process.env.EXTERNAL_API_URL = 'https://f1gw.dev.bizmotionapp.com/';

const utilFunctions = require('../utils/util-functions');

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