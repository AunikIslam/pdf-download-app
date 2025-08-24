class TopSheetData {
    constructor() {
        this.userId = null;
        this.user = null;
        this.market = null;
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

    setMarket(market) {
        this.market = market;
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

    setDiscountInfos(discountInfos) {
        this.discountInfos = discountInfos;
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
            this.unit = null;
            this.bonus = null;
            this.totalUnit = null;
            this.totalVolume = null;
            this.ctn = null;
            this.subTotal = null;
            this.discountTotal = null;
            this.totalAmount = null;
            this.measurementUnit = null;
        }

        setDistributorId(id) { this.distributorId = id; return this;}
        setDistributor(distributor) { this.distributor = distributor; return this;}
        setProductId(id) { this.productId = id; return this; }
        setProduct(product) { this.product = product; return this; }
        setUnit(unit) { this.unit = unit; return this; }
        setBonus(bonus) { this.bonus = bonus; return this; }
        setTotalUnit(total) { this.totalUnit = total; return this; }
        setCtn(ctn) { this.ctn = ctn; return this; }
        setSubTotal(subTotal) { this.subTotal = subTotal; return this; }
        setDiscountTotal(discount) { this.discountTotal = discount; return this; }
        setTotalAmount(amount) { this.totalAmount = amount; return this; }
        setTotalVolume(volume) { this.totalVolume = volume; return this; }
        setMeasurementUnit(measurementUnit) { this.measurementUnit = measurementUnit; return this; }
        build() { return this; }
    }
}

module.exports = TopSheetData;