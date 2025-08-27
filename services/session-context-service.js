const {AsyncLocalStorage} = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

class SessionContextService {
    static initialize(context, callback) {
        asyncLocalStorage.run(context, callback);
    }

    static setToken(value) {
        asyncLocalStorage.getStore().token = value;
    }

    static getToken() {
        return asyncLocalStorage.getStore().token;
    }

    static setSelf(value) {
        asyncLocalStorage.getStore().self = value;
    }

    static getSelf() {
        return asyncLocalStorage.getStore().self;
    }

    static setPermissions(value) {
        asyncLocalStorage.getStore().permissions = value;
    }

    static getPermissions() {
        return asyncLocalStorage.getStore().permissions;
    }

    static getUserId() {
        return asyncLocalStorage.getStore().self.userId;
    }
}

module.exports = SessionContextService;