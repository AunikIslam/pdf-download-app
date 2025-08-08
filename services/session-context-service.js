const {AsyncLocalStorage} = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

class SessionContextService {
    static initialize(context, callback) {
        asyncLocalStorage.run(context, callback);
    }

    static getStorage() {
        return asyncLocalStorage.getStore();
    }
}

module.exports = SessionContextService;