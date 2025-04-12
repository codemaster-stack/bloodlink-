const swaggerJSDoc = require("swagger-jsdoc"); 
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "LifeLink API", // Your API title
      version: "1.0.0", // Your API version
      description: "API for LifeLink Blood Donation Platform", // Your API description
    },
    servers: [
      {
        url: "https://bloodlink-2ucr.onrender.com", // Base URL of your API
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http", // Should be 'http' for Bearer auth
          scheme: "bearer",
          bearerFormat: "JWT", // JWT format
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Security requirement for API routes
      },
    ],
  },
  apis: ["./swaggerDoc.js"], // File containing annotations for API routes (if any)
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Use the Swagger UI
};

module.exports = setupSwaggerDocs;
