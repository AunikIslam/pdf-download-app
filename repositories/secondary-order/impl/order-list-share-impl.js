const orderListShareSql = require('../sql/order-list-share-sql');
const approveFilterEnum = require('../../../enum/approve-filter-enum');
const utilFunctions = require('../../../utils/util-functions');
const sequelize = require('../../../utils/database-connection');
const marketFilterImpl = require('../../market/impl/market-filter-impl');
const product = require('../../../models/product/product-model');
const distributor = require('../../../models/distributor/distributor-model');
const marketImpl = require('../../market/impl/market-impl');
const user = require('../../../models/user/user-model');
const sessionContextService = require('../../../services/session-context-service');
const TopSheetData = require('../../../models/secondary-order/top-sheet-data');
const pdfPreparationImpl = require('../impl/pdf-preparation-impl');

class OrderListShareImpl {
    static async getDataToShareOrder(params) {
        try {
            const self = sessionContextService.getSelf();
            const marketFilter = await marketFilterImpl.getAccessibleMarketIdsUsingFilter({
                marketFilter: params.marketIds,
                activeOnly: true
            });
            const orderIdsQuery = orderListShareSql.getOrderIdsSql();
            const orderIdsReplacements = {
                org_filter: self.orgId,
                from_date: params.fromDate,
                to_date: params.toDate,
                status_filter: utilFunctions.findEnumOrdinal(approveFilterEnum, params.status),
                db_filter: params.distributorId,
                retailer_filter: params.retailerId,
                market_filter: marketFilter.size > 0 ? Array.from(marketFilter) : [0]
            }
            const orderIdsQueryResult = await sequelize.query(orderIdsQuery, {
                replacements: orderIdsReplacements,
                type: sequelize.QueryTypes.SELECT,
            });
            const orderIdList = orderIdsQueryResult.map(row => Number(row.id));

            // console.log(`Order Id List`)
            // console.log(orderIdList)

            /* Code injection required: Need to add check if order id list is empty */

            return await this.prepareTopSheet(orderIdList);

        } catch (error) {
            console.error(`$Error from order ids fetch: ${error.message}`);
        }

    }

    static async prepareTopSheet(orderIdList) {
        try {
            const topSheetQuery = orderListShareSql.getInfoForTopSheetOfAfmSql();
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

            itemInfos.forEach(item => {
                productIdSet.add(Number(item.productid));
                distributorIdSet.add(Number(item.distributorid));
                marketIdSet.add(Number(item.marketid));
            });

            const productIdArray = Array.from(productIdSet);
            const distributorIdArray = Array.from(distributorIdSet);
            const marketIdArray = Array.from(marketIdSet);

            const [products, distributors, users, markets] = await Promise.all([
                product.findAll({
                    attributes: ['id', 'name', 'code', 'measurementUnit'],
                    where: {
                        id: productIdArray
                    }
                }),
                distributor.findAll({
                    where: {
                        id: distributorIdArray
                    }
                }),
                user.findAll({
                    attributes: ['id', 'name', 'code', 'mobile', 'phone'],
                    where: {
                        id: sessionContextService.getUserId()
                    }
                }),
                marketImpl.findAll(marketIdArray),
            ]);

            const productMap = new Map();
            const distributorMap = new Map();

            products.forEach(product => {
                productMap.set(Number(product.id), product);
            });

            distributors.forEach(distributor => {
                distributorMap.set(Number(distributor.id), distributor);
            });

            let topSheetMap = new Map();

            distributorIdArray.forEach((distributorId, index) => {
                const topSheetData = new TopSheetData();
                topSheetData.setDistributorId(distributorId);
                topSheetData.setDistributor(distributorMap.get(distributorId));
                topSheetData.setUserId(users[0].id);
                topSheetData.setUser(users[0]);
                topSheetMap.set(distributorId, topSheetData);
            });

            for (const itemInfo of itemInfos) {
                const item = new TopSheetData.ItemInfo();
                item.setProductId(Number(itemInfo.productid));
                item.setProduct(productMap.get(Number(itemInfo.productid)));
                item.setTotalVolume(itemInfo.totalvolume);
                item.setTotalUnit(itemInfo.totalunit);
                item.setTotalAmount(itemInfo.totalamount);
                item.setMeasurementUnit(productMap.get(Number(itemInfo.productid)).measurementUnit);
                const topSheet = topSheetMap.get(Number(itemInfo.distributorid));
                topSheet.setItemInfos(item);
            }
            return pdfPreparationImpl.prepareSecondaryOrderPdfForAfm(topSheetMap);

        } catch (error) {
            console.log(`Error from top sheet info fetch: ${error.message}`);
        }
    }
}

module.exports = OrderListShareImpl;