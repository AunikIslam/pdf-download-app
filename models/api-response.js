class ApiResponse {
    constructor(content = null, page = {}, statusCode = 200, statusMessage = 'Successful') {
        this.data = {
            content,
            page: {
                size: page.size || 0,
                number: page.number || 0,
                totalElements: page.totalElements || 0,
                totalPages: page.totalPages || 0
            }
        };
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    }
}

module.exports = ApiResponse;