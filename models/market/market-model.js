const marketLevelModel = require('./market-level-model');
const parentMarketModel = require('./parent-market-model');

class MarketModel {
    constructor(id = null, isActive = true, name = null, code = null,
                marketLevel = new marketLevelModel(), parents = []) {
        this.id = id;
        this.isActive = isActive;
        this.name = name;
        this.code = code;
        this.marketLevel = marketLevel;
        this.parents = parents;

    }
}
module.exports = MarketModel;