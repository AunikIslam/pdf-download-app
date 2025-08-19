const marketFilterImpl = require('../repositories/market/impl/market-filter-impl');
const marketFilterSql = require('../repositories/market/sql/market-filter-sql');
const sequelize = require('../utils/database-connection');
const sessionContextService = require('../services/session-context-service');

jest.mock('../services/session-context-service');
jest.mock('../repositories/market/sql/market-filter-sql');
jest.mock('../utils/database-connection', () => ({
    query: jest.fn(),
    QueryTypes: {
        SELECT: 'SELECT'
    }
}));

describe('get market accessible ids', () => {
    it('should return a set of accessible market ids', async () => {
        sessionContextService.getSelf.mockReturnValue({
            orgId: 1,
            userId: 2,
            hasMarketLevel: true
        });
        marketFilterSql.accessibleMarketSQL.mockReturnValue('SELECT');

        sequelize.query.mockResolvedValue([
            {marketid: '1'},
            {marketid: '2'},
            {marketid: '3'}
        ]);

        const result = await marketFilterImpl.getAccessibleMarketIds();

        expect(marketFilterSql.accessibleMarketSQL).toHaveBeenCalled();
        expect(sequelize.query).toHaveBeenCalledWith('SELECT', {
            replacements: {
                organization_id: 1,
                user_id: 2,
                has_market_level: true,
                active_only: true
            },
            type: 'SELECT'
        });
        expect(result).toEqual(new Set([1, 2, 3]))
    });
});


describe('filter apply function', () => {
    it('should return filtered markets', async () => {
        jest.spyOn(marketFilterImpl, 'childrenOf').mockResolvedValue(new Set([2, 3]))
        const params = {
            marketFilter: [2],
            activeOnly: true,
            accessibleMarketIds: new Set([1, 2, 3])
        };

        const result = await marketFilterImpl.childrenOf(params);

        expect(marketFilterImpl.childrenOf).toHaveBeenCalled();
        expect(result).toEqual(new Set([2, 3]));
    });
});

describe('filtered markets api call', () => {
    it('should return the filtered markets', async () => {
        jest.spyOn(marketFilterImpl, 'getAccessibleMarketIds').mockResolvedValue(new Set([1, 2, 3]));
        jest.spyOn(marketFilterImpl, 'childrenOf').mockResolvedValue(new Set([2, 3]));
        const params = {
            marketFilter: [2],
            activeOnly: true
        }
        const result = await marketFilterImpl.getAccessibleMarketIdsUsingFilter(params);
        expect(marketFilterImpl.getAccessibleMarketIds).toHaveBeenCalled();
        expect(marketFilterImpl.childrenOf).toHaveBeenCalled();
        expect(result).toEqual(new Set([2, 3]));
    });
})