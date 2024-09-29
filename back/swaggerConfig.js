// swaggerConfig.js

const swaggerJsdoc = require('swagger-jsdoc');

 
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product API Documentation',
    version: '1.0.0',
    description: 'API documentation for the product management system',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

 
const options = {
  swaggerDefinition,
  apis: ['./index.js', './products.js'],  
};

 
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
