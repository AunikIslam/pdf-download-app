class TopSheetDataAfm {
    constructor() {
        this.userId = null;
        this.user = null;
        this.marketIds = [];
        this.markets = [];
        this.distributorId = null;
        this.distributor = null;
        this.itemInfos = [];
        this.discountInfos = [];
        this.orderAmount = 0;
    }

    setUserId(userId) {
        this.userId = userId;
        return this;
    }

    setUser(user) {
        this.user = user;
        return this;
    }

    setMarketIds(marketIds) {
        this.marketIds = marketIds;
    }

    setMarkets(markets) {
        this.markets = markets;
        return this;
    }

    setDistributorId(id) {
        this.distributorId = id;
        return this;
    }

    setDistributor(distributor) {
        this.distributor = distributor;
        return this;
    }

    setItemInfos(itemInfo) {
        this.itemInfos.push(itemInfo);
        return this;
    }

    setOrderAmount(orderAmount) {
        this.orderAmount = orderAmount;
        return this;
    }

    static ItemInfo = class {
        constructor() {
            this.distributorId = null;
            this.distributor = null;
            this.productId = null;
            this.product = null;
            this.totalUnit = null;
            this.totalVolume = null;
            this.totalAmount = null;
            this.measurementUnit = null;
        }

        setDistributorId(id) { this.distributorId = id; return this;}
        setDistributor(distributor) { this.distributor = distributor; return this;}
        setProductId(id) { this.productId = id; return this; }
        setProduct(product) { this.product = product; return this; }
        setTotalUnit(total) { this.totalUnit = total; return this; }
        setTotalAmount(amount) { this.totalAmount = amount; return this; }
        setTotalVolume(volume) { this.totalVolume = volume; return this; }
        setMeasurementUnit(measurementUnit) { this.measurementUnit = measurementUnit; return this; }
        build() { return this; }
    }
}

module.exports = TopSheetDataAfm;