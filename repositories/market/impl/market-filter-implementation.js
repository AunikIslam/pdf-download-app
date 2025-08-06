const marketFilterSql = require('../sql/market-filter-sql')
const sequelize = require('../../../utils/database-connection');

class MarketFilterImplementation {
    static async getAccessibleMarketIds(params) {
        const query = marketFilterSql.accessibleMarketSQL().query;
        const replacements = {
            organization_id: params.organizationId,
            user_id: params.userId,
            has_market_level: params.hasMarketLevel,
            active_only: params.activeOnly
        }
        const results = await sequelize.query(query, {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT,
        });
        return new Set(results.map(row => row.marketid));
    }
}

module.exports = MarketFilterImplementation;