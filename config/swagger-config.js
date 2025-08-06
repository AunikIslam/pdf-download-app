const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API documentation for your Node.js project',
        },
        servers: [
            {
                url: '{host_url}/pdf-manager',
                description: 'The production API server',
                variables: {
                    host_url: {
                        default: 'http://localhost:3000'
                    }
                }
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    apis: ['./routes/*.js', './response-schemas/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/pdf-manager/swagger-ui/index.html', swaggerUi.serve, swaggerUi.setup(specs));
};