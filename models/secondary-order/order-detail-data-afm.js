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
        this.productIds = [];
        this.productInfos = [];
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

    static ProductInfo = class {
        constructor() {
            this.product = null;
            this.etp = null;
            this.pcs = null;
            this.volume = null;
        }

        setProduct(product) {
            this.product = product;
            return this;
        }

        setEtp(price) {
            this.etp = price;
            return this;
        }

        setPcs(pcs) {
            this.pcs = pcs;
            return this;
        }

        setVolume(volume) {
            this.volume = volume;
            return this;
        }
    }
}

module.exports = OrderDetailDataAfm;