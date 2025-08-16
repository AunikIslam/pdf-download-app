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
    it('should return a set of accessible market ids', async  () => {
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

})