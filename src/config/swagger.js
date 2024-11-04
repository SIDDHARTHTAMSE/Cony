// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'API Documentation', // Title of your API
      version: '1.0.0', // Version of your API
      description: 'API documentation for my Express application', // Description of your API
    },
    servers: [
      {
        url: 'http://localhost:8080', // Base URL of your API
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
