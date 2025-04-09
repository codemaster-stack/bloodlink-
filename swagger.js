const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hospital API Docs",
      version: "1.0.0",
      description: "API documentation for Hospital/Admin system",
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
  apis: ["./swaggerDoc.js"], // You can add './routes/*.js' here too if needed
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
