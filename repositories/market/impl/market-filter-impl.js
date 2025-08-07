const marketFilterSql = require('../sql/market-filter-sql')
const sequelize = require('../../../utils/database-connection');
const marketFilterImpl = require("./market-filter-impl");
const baseService = require('../../../services/base-service')

class MarketFilterImpl {
    static async getAccessibleMarketIdsUsingFilter(params) {
        const accessibleMarketIds = await this.getAccessibleMarketIds();
        return this.applyFilter({
            marketFilter: params.marketFilter,
            activeOnly: params.activeOnly,
            accessibleMarketIds
        })
    }

    static async getAccessibleMarketIds() {
        const sessionContext = baseService.getSessionContext();
        const query = marketFilterSql.accessibleMarketSQL();
        const replacements = {
            organization_id: sessionContext.organizationId,
            user_id: sessionContext.userId,
            has_market_level: true,
            active_only: true
        }
        const results = await sequelize.query(query, {
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT,
        });
        return new Set(results.map(row => JSON.parse(row.marketid)));
    }

    static async childrenOf(params) {
        const sessionContext = baseService.getSessionContext();
        try {
            const query = marketFilterSql.filteredMarketSQL();
            const replacements = {
                organization_id: sessionContext.organizationId,
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
        if (params.marketFilter == null) {
            return params.accessibleMarketIds;
        }
        try {
            const filtered = await this.childrenOf(params);
            console.log(`accessible markets`)
            console.log(params.accessibleMarketIds);
            console.log(`filtered markets`)
            console.log(filtered);
            const retained = new Set();
            for (const id of params.accessibleMarketIds) {
                if (filtered.has(id)) {
                    retained.add(id);
                }
            }
            console.log(`retained markets`)
            console.log(retained);
            return retained;
        }
        catch (error) {
            console.log(`Error from apply filter`);
            console.log(error.message);
        }

    }
}

module.exports = MarketFilterImpl;