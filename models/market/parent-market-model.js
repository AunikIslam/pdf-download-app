const marketLevelModel = require('./market-level-model');
class ParentMarketModel {
    constructor(id = null, name = null, code = null, marketLevel = new marketLevelModel()  ) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.marketLevel = marketLevel;
    }
}

module.exports = ParentMarketModel;