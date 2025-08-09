const marketFilterSql = require('../sql/market-filter-sql')
const sequelize = require('../../../utils/database-connection');
const sessionContextStorage = require('../../../services/session-context-service')

class MarketFilterImpl {
    static async getAccessibleMarketIdsUsingFilter(params) {
        const accessibleMarketIds = await this.getAccessibleMarketIds();
        return this.applyFilter({
            marketFilter: params.marketFilter && params.marketFilter.length > 0 ? params.marketFilter : [0],
            activeOnly: params.activeOnly,
            accessibleMarketIds
        })
    }

    static async getAccessibleMarketIds() {
        const self = sessionContextStorage.getSelf();
        const query = marketFilterSql.accessibleMarketSQL();
        const replacements = {
            organization_id: self.orgId,
            user_id: self.userId,
            has_market_level: self.hasMarketLevel,
            active_only: true
        }
        const results = await sequelize.query(query, {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT,
        });
        return new Set(results.map(row => JSON.parse(row.marketid)));
    }

    static async childrenOf(params) {
        const self = sessionContextStorage.getSelf();
        try {
            const query = marketFilterSql.filteredMarketSQL();
            const replacements = {
                organization_id: self.orgId,
                active_only: params.activeOnly,
                market_id_filter: params.marketFilter,
            }
            const results = await sequelize.query(query, {
                replacements: replacements,
                type: sequelize.QueryTypes.SELECT,
            });

            return new Set(results.map(row => JSON.parse(row.marketid)));
        }
        catch (error) {
            console.log(`Error from children of`);
            console.log(error.message);
        }
    }

    static async applyFilter(params) {
        if (params.marketFilter == null || params.marketFilter.length === 0) {
            return params.accessibleMarketIds;
        }
        try {
            const filtered = await this.childrenOf(params);
            const retained = new Set();
            for (const id of params.accessibleMarketIds) {
                if (filtered.has(id)) {
                    retained.add(id);
                }
            }
            return retained;
        }
        catch (error) {
            console.log(`Error from apply filter`);
            console.log(error.message);
        }

    }
}

module.exports = MarketFilterImpl;