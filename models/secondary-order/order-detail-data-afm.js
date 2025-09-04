class OrderDetailDataAfm {
    constructor() {
        this.orderId = null;
        this.orderDate = null;
        this.userId = null;
        this.user = null;
        this.retailerId = null;
        this.retailer = null;
        this.distributorId = null;
        this.distributor = null;
        this.remarks = null;
        this.isApproved = null;
        this.productIds = [];
        this.productInfos = [];
        this.totalVolume = 0;
        this.totalAmount = 0;
        this.marketId = null;
        this.market = null;
    }

    setOrderId(orderId) {
        this.orderId = orderId;
        return this;
    }

    setOrderDate(orderDate) {
        this.orderDate = orderDate;
        return this;
    }

    setUserId(userId) {
        this.userId = userId;
        return this;
    }

    setUser(user) {
        this.user = user;
        return this;
    }

    setDistributorId(distributorId) {
        this.distributorId = distributorId;
        return this;
    }

    setDistributor(distributor) {
        this.distributor = distributor;
        return this;
    }

    setRetailerId(retailerId) {
        this.retailerId = retailerId;
        return this;
    }

    setRetailer(retailer) {
        this.retailer = retailer;
        return this;
    }

    setRemarks(remarks) {
        this.remarks = remarks;
        return this;
    }

    setProductIds(id) {
        this.productIds.push(id);
        return this;
    }

    setProductInfos(productInfo) {
        this.productInfos.push(productInfo);
        return this;
    }

    setApproval(approval) {
        this.isApproved = approval;
        return this;
    }

    setTotalVolume(volume) {
        this.totalVolume += volume;
        return this;
    }

    setTotalAmount(amount) {
        this.totalAmount += amount;
        return this;
    }

    setMarketId(id) {
        this.marketId = id;
        return this;
    }

    setMarket(market) {
        this.market = market;
        return this;
    }
}

module.exports = OrderDetailDataAfm;