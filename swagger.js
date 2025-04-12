const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LifeLink API",
      version: "1.0.0",
      description: "API for LifeLink Blood Donation Platform",
    },
    servers: [
      {
        url: "https://bloodlink-2ucr.onrender.com",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "https",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './docs/*.yaml'],
  apis: ["./swaggerDoc.js"], // You can add './routes/*.js' here too if needed
};

const swaggerSpec = swaggerJSDoc(options);
const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
module.exports = setupSwaggerDocs;
