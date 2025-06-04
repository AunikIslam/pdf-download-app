const corsOptions = {
    origin: 'http://localhost:4200/',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    // allowedHeaders: [
    //     'Content-Type',
    //     'Authorization',
    //     'Accept',
    //     'Origin',
    //     'Cache-Control',
    //     'X-Requested-With',
    // ],
    allowedHeaders: '*',
    credentials: false,
    maxAge: 86400
};
module.exports = corsOptions
