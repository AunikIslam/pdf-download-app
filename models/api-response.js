const utilFunctions = require('../utils/util-functions')
exports.Success = class Success {
    constructor(content = null, page = {}, statusCode = 200, statusMessage = 'Successful') {
        if (typeof content === 'string') {
            this.data = {
                id: content
            }
        } else {
            this.data = {
                content,
            };
        }
        this.page = page;
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.timestamp = utilFunctions.datePipe(new Date(), 'yyyy-MM-dd hh:mm:ss');
    }
};

exports.Error = class Error {
    constructor(errors = ['Contact Support'], statusCode = 500) {
        if (errors.length > 1) {
            this.errors = errors;
        } else {
            this.error = errors[0];
        }
        this.statusCode = statusCode;
        this.timestamp = utilFunctions.datePipe(new Date(), 'yyyy-MM-dd hh:mm:ss');
    }
};

exports.LocalMessage = class LocalMessage {
    constructor(content, code = 200, message = null) {
        this.content = content;
        this.code = code;
        this.message = message;
    }
}
