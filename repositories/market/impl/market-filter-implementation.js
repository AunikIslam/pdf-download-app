const marketFilterSql = require('../sql/market-filter-sql')
const sequelize = require('../../../utils/database-connection');

class MarketFilterImplementation {
    static async getAccessibleMarketIds(params) {
        const query = marketFilterSql.accessibleMarketSQL().query;
        let replacements = marketFilterSql.accessibleMarketSQL().replacements;
        replacements = {
            organization_id: params.organizationId,
            user_id: params.userId,
            has_market_level: params.hasMarketLevel,
            active_only: params.activeOnly
        }
        const [results] = await sequelize.query(query, {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT,
        });
        console.log(results);
    }
}

module.exports = MarketFilterImplementation;