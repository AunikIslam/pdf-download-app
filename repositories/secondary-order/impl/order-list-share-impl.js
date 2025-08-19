const orderListShareSql = require('../sql/order-list-share-sql');
const approveFilterEnum = require('../../../enum/approve-filter-enum');
const utilFunctions = require('../../../utils/util-functions');
const sequelize = require('../../../utils/database-connection');
const marketFilterImpl = require('../../market/impl/market-filter-impl');
const product = require('../../../models/product/product-model');
const distributor = require('../../../models/distributor/distributor-model');
const marketImpl = require('../../market/impl/market-impl');
const user = require('../../../models/user/user-model');

class OrderListShareImpl {
    static async getDataToShareOrder(params) {
        try {
            const marketFilter = await marketFilterImpl.getAccessibleMarketIdsUsingFilter({
                marketFilter: params.marketIds,
                activeOnly: true
            });
            const orderIdsQuery = orderListShareSql.getOrderIdsSql();
            const orderIdsReplacements = {
                org_filter: params.organizationId,
                from_date: params.fromDate,
                to_date: params.toDate,
                status_filter: utilFunctions.findEnumOrdinal(approveFilterEnum, params.status),
                db_filter: params.distributorId || 0,
                retailer_filter: params.retailerId || 0,
                market_filter: marketFilter.size > 0 ? Array.from(marketFilter) : [0]
            }
            const orderIdsQueryResult = await sequelize.query(orderIdsQuery, {
                replacements: orderIdsReplacements,
                type: sequelize.QueryTypes.SELECT,
            });
            const orderIdList = orderIdsQueryResult.map(row => Number(row.id));
            await this.prepareTopSheet(orderIdList.length > 0 ? orderIdList : [0]);

        } catch (error) {
            console.error(error.message);
        }

    }

    static async prepareTopSheet(orderIdList) {
        try {
            const topSheetQuery = orderListShareSql.getItemInfoForTopSheetSql();
            const topSheetReplacements = {
                order_ids: orderIdList
            }
            const topSheetQueryResult = await sequelize.query(topSheetQuery, {
                replacements: topSheetReplacements,
                type: sequelize.QueryTypes.SELECT
            });
            const itemInfos = Array.from(topSheetQueryResult);
            const productIdSet = new Set();
            const distributorIdSet = new Set();
            const marketIdSet = new Set();
            const userIdSet = new Set();

            for (const item of itemInfos) {
                productIdSet.add(Number(item.productid));
                distributorIdSet.add(Number(item.distributorid));
                marketIdSet.add(Number(item.marketid));
                userIdSet.add(Number(item.userid));
            }

            const productIdArray = Array.from(productIdSet);
            const distributorIdArray = Array.from(distributorIdSet);
            const marketIdArray = Array.from(marketIdSet);
            const userIdArray = Array.from(userIdSet);

            const [products, distributors, markets, users] = await Promise.all([
                product.findAll({
                    where: {
                        id: productIdArray
                    }
                }),
                distributor.findAll({
                    where: {
                        id: distributorIdArray
                    }
                }),
                marketImpl.findAll(marketIdArray),
                user.findAll({
                    where: {
                        id: userIdArray
                    }
                })
            ]);

            // console.log(products);
            // console.log(distributors);
            // console.log(markets);
            // console.log(users);

        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = OrderListShareImpl;