const orderListShareSql = require('../sql/order-list-share-sql');
const approveFilterEnum = require('../../../enum/approve-filter-enum');
const utilFunctions = require('../../../utils/util-functions');
const sequelize = require('../../../utils/database-connection');
const marketFilterImpl = require('../../market/impl/market-filter-impl');
const product = require('../../../models/product/product-model');
const distributor = require('../../../models/distributor/distributor-model');
const user = require('../../../models/user/user-model');
const marketImpl = require('../../market/impl/market-impl');
const retailer = require('../../../models/retailers/retailer-model');
const sessionContextService = require('../../../services/session-context-service');
const TopSheetDataAfm = require('../../../models/secondary-order/top-sheet-data-afm');
const OrderDetailDataAfm = require('../../../models/secondary-order/order-detail-data-afm');
const pdfPreparationImpl = require('../impl/pdf-preparation-impl');


class OrderListShareImplAfm {
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

            if (orderIdList.length === 0) {
                return 0;
            }
            return await this.prepareSecondaryOrderPdfForAfm(orderIdList);

        } catch (error) {
            console.error(`$Error from order ids fetch: ${error.message}`);
        }

    }

    static async prepareSecondaryOrderPdfForAfm(orderIdList) {
        try {
            const topSheetQuery = orderListShareSql.getInfoForTopSheetOfAfmSql();
            const detailQuery = orderListShareSql.getOrderDetailOfAfmSql();

            const replacements = {
                order_ids: orderIdList
            }

            const [topSheetQueryResult, detailQueryResult] = await Promise.all([
                await sequelize.query(topSheetQuery, {
                    replacements: replacements,
                    type: sequelize.QueryTypes.SELECT
                }),
                await sequelize.query(detailQuery, {
                    replacements: replacements,
                    type: sequelize.QueryTypes.SELECT
                })
            ]);

            const topSheetItems = Array.from(topSheetQueryResult);
            const detailItems = Array.from(detailQueryResult);

            console.log(topSheetItems);
            console.log(detailItems);

            const productIdSet = new Set();
            const distributorIdSet = new Set();
            const marketIdSet = new Set();
            const retailerIdSet = new Set();
            const userIdSet = new Set();

            topSheetItems.forEach(item => {
                productIdSet.add(Number(item.productid));
                distributorIdSet.add(Number(item.distributorid));
                marketIdSet.add(...item.marketid);
            });

            detailItems.forEach(item => {
                retailerIdSet.add(Number(item.retailerid));
                userIdSet.add(Number(item.userid));
            })

            const productIdArray = Array.from(productIdSet);
            const distributorIdArray = Array.from(distributorIdSet);
            const marketIdArray = Array.from(marketIdSet);
            const retailerIdArray = Array.from(retailerIdSet);
            const userIdArray = Array.from(userIdSet);

            const [
                products,
                distributors,
                loggedUser,
                markets,
                retailers,
                users
            ] = await Promise.all([
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
                user.findOne({
                    attributes: ['id', 'name', 'code', 'mobile', 'phone'],
                    where: {
                        id: sessionContextService.getUserId()
                    }
                }),
                marketImpl.findAll(marketIdArray),
                retailer.findAll({
                    attributes: ['id', 'name', 'code', 'ownerName', 'ownerPhone', 'mobile', 'phone', 'address'],
                    where: {
                        id: retailerIdArray
                    }
                }),
                user.findAll({
                    attributes: ['id', 'name', 'code', 'mobile', 'phone'],
                    where: {
                        id: userIdArray
                    }
                })
            ]);

            const productMap = new Map();
            const distributorMap = new Map();
            const marketMap = new Map();
            const retailerMap = new Map();
            const userMap = new Map();
            const marketMapByDistributor = new Map();

            products.forEach(product => {
                productMap.set(Number(product.id), product);
            });

            distributors.forEach(distributor => {
                distributorMap.set(Number(distributor.id), distributor);
            });

            markets.forEach(market => {
                marketMap.set(Number(market.marketid), market);
            });

            retailers.forEach(retailer => {
                retailerMap.set(Number(retailer.id), retailer);
            });

            users.forEach(user => {
                userMap.set(Number(user.id), user);
            });

            let topSheetMap = new Map();
            let detailInfoMap = new Map();

            distributorIdArray.forEach((distributorId, index) => {
                const topSheetData = new TopSheetDataAfm();
                topSheetData.setDistributorId(distributorId);
                topSheetData.setDistributor(distributorMap.get(distributorId));
                topSheetData.setUserId(Number(loggedUser.id));
                topSheetData.setUser(loggedUser);
                topSheetData.setTotalAmount(0);
                topSheetData.setTotalUnit(0);
                marketMapByDistributor.set(distributorId, new Set())
                topSheetMap.set(distributorId, topSheetData);
            });

            let itemCounter = 0;
            for (const itemInfo of topSheetItems) {
                const item = new TopSheetDataAfm.ItemInfo();
                itemCounter++;
                item.setProductId(Number(itemInfo.productid));
                item.setProduct(productMap.get(Number(itemInfo.productid)));
                item.setTotalVolume(itemInfo.totalvolume);
                item.setTotalUnit(utilFunctions.currencyPipe(itemInfo.totalunit));
                item.setTotalAmount(utilFunctions.currencyPipe(itemInfo.totalamount));
                item.setMeasurementUnit(productMap.get(Number(itemInfo.productid)).measurementUnit);
                item.setSerial(itemCounter);
                const previousIds = Array.from(marketMapByDistributor.get(Number(itemInfo.distributorid)));
                marketMapByDistributor.set(Number(itemInfo.distributorid), new Set([...previousIds, ...itemInfo.marketid]));
                const topSheet = topSheetMap.get(Number(itemInfo.distributorid));
                topSheet.setItemInfos(item);
                topSheet.setTotalUnit(itemInfo.totalunit);
                topSheet.setTotalAmount(itemInfo.totalamount);
                topSheet.setTotalVolume(itemInfo.totalvolume);
            }

            distributorIdArray.forEach(distributorId => {
                const marketIds = Array.from(marketMapByDistributor.get(distributorId));
                const markets = [];
                marketIds.forEach(marketId => {
                    markets.push(marketMap.get(marketId));
                });
                const topSheet = topSheetMap.get(distributorId);
                topSheet.setMarkets(markets);
                topSheet.setMarketIds(marketIds);
            });


            for (const item of detailItems) {
                if (detailInfoMap.has(Number(item.orderid))) {
                    const detailInfo = detailInfoMap.get(Number(item.orderid));
                    detailInfo.setProductIds(Number(item.productid));
                    detailInfo.setTotalVolume(item.volume);
                    detailInfo.setTotalAmount(item.total);
                    detailInfo.setProductInfos({
                        serial: detailInfo.productInfos.length + 1,
                        product: productMap.get(Number(item.productid)),
                        etp: utilFunctions.currencyPipe(item.etp),
                        pcs: utilFunctions.currencyPipe(item.pcs),
                        volume: utilFunctions.currencyPipe(item.volume),
                        total: utilFunctions.currencyPipe(item.total)
                    })
                } else {
                    const detailInfo = new OrderDetailDataAfm();
                    detailInfo.setOrderId(Number(item.orderid));
                    detailInfo.setOrderDate(utilFunctions.datePipe(item.orderdate, `dd-MMM-yyyy hh:mm a`));
                    detailInfo.setUserId(Number(item.userid));
                    detailInfo.setUser(userMap.get(Number(item.userid)));
                    detailInfo.setDistributorId(item.distributorid);
                    detailInfo.setDistributor(distributorMap.get(Number(item.distributorid)));
                    detailInfo.setRetailerId(Number(item.retailerid));
                    detailInfo.setRetailer(retailerMap.get(Number(item.retailerid)));
                    detailInfo.setRemarks(item.remarks);
                    detailInfo.setProductIds(Number(item.productid));
                    detailInfo.setApproval(utilFunctions.approvalPipe(item.isapproved));
                    detailInfo.setTotalAmount(item.total);
                    detailInfo.setTotalVolume(item.volume);
                    detailInfo.setMarketId(Number(item.marketid));
                    detailInfo.setMarket(marketMap.get(Number(item.marketid)));
                    detailInfo.setProductInfos({
                        serial: 1,
                        product: productMap.get(Number(item.productid)),
                        etp: utilFunctions.currencyPipe(item.etp),
                        pcs: utilFunctions.currencyPipe(item.pcs),
                        volume: utilFunctions.currencyPipe(item.volume),
                        total: utilFunctions.currencyPipe(item.total)
                    });
                    detailInfoMap.set(Number(item.orderid), detailInfo);
                }
            }
            let detailInfoList = [];
            let topSheetInfoList = [];

            const topSheetSliceSize = 18;
            const sliceSize = 18;

            topSheetMap.forEach((value, key) => {
                const {itemInfos, totalAmount, totalUnit, totalVolume, ...rest} = value;
                const numberOfSlices = Math.ceil(itemInfos.length / topSheetSliceSize);
                for (let sliceNo = 0; sliceNo < numberOfSlices; sliceNo++) {
                    const slicedProducts =
                        itemInfos
                            .slice((sliceNo * sliceSize), (sliceNo * sliceSize) + sliceSize);
                    topSheetInfoList.push({
                        itemInfos: slicedProducts,
                        totalAmount: utilFunctions.currencyPipe(totalAmount),
                        totalUnit: utilFunctions.currencyPipe(totalUnit),
                        totalVolume: utilFunctions.currencyPipe(totalVolume),
                        ...rest
                    });
                }
            });

            const lastItem2 = topSheetInfoList[topSheetInfoList.length - 1];
            lastItem2['isLastPage'] = true;
            detailInfoMap.forEach((value, key) => {
                const {productInfos, totalVolume, totalAmount, ...rest} = value;
                const numberOfSlices = Math.ceil(productInfos.length / sliceSize);
                const truncatedTotalVolume = utilFunctions.currencyPipe(totalVolume);
                const truncatedTotalAmount = utilFunctions.currencyPipe(totalAmount);
                for (let sliceNo = 0; sliceNo < numberOfSlices; sliceNo++) {
                    const slicedProducts =
                        productInfos
                            .slice((sliceNo * sliceSize), (sliceNo * sliceSize) + sliceSize);
                    detailInfoList.push({
                        productInfos: slicedProducts,
                        totalAmount: truncatedTotalAmount,
                        totalVolume: truncatedTotalVolume,
                        ...rest
                    });
                }
            });
            const lastItem = detailInfoList[detailInfoList.length - 1];
            lastItem['isLastPage'] = true;
            return await pdfPreparationImpl.prepareSecondaryOrderPdfForAfm(topSheetInfoList, detailInfoList);

        } catch (error) {
            console.log(`Error from top sheet info fetch: ${error.message}`);
        }
    }
}

module.exports = OrderListShareImplAfm;