const {AsyncLocalStorage} = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

class SessionContextService {
    static initialize(context, callback) {
        asyncLocalStorage.run(context, callback);
    }

    static setDataByKey(key, value) {
        const store = asyncLocalStorage.getStore();
        if (store) {
            store[key] = value;
        }
    }

    static getDataByKey(key) {
        const store = asyncLocalStorage.getStore();
        return store ? store[key] : null;
    }
}

module.exports = SessionContextService;