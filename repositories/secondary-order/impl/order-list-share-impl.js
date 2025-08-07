const orderListShareSql = require('../sql/order-list-share-sql');
const approveFilterEnum = require('../../../enum/approve-filter-enum');
const utilFunctions = require('../../../utils/util-functions');
const sequelize = require('../../../utils/database-connection');
const marketFilterImpl = require('../../market/impl/market-filter-impl');
const Sequelize = require('sequelize');

class OrderListShareImpl {
    static async getDataToShareOrder(params) {
        try {
            const marketFilter = await marketFilterImpl.getAccessibleMarketIdsUsingFilter({
                marketFilter: params.marketIds,
                activeOnly: true
            });
            const query = orderListShareSql.getOrderIdsSql();
            const replacements = {
                org_filter: params.organizationId,
                from_date: params.fromDate,
                to_date: params.toDate,
                status_filter: utilFunctions.findEnumOrdinal(approveFilterEnum, params.status),
                db_filter: params.distributorId || 0,
                retailer_filter: params.retailerId || 0,
                market_filter: Array.from(marketFilter)
            }
            const results = await sequelize.query(query, {
                replacements: replacements,
                type: sequelize.QueryTypes.SELECT,
            });

        } catch (error) {
            console.error(error.message);
        }

    }
}

module.exports = OrderListShareImpl;