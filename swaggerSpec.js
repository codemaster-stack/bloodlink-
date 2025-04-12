const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", //  Make sure this is spelled correctly and is at this level
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
          type: "http",
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
  apis: ["./swaggerDoc.js"], // Or "./routes/*.js" if you're using JSDoc in routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; //  Export the spec directly
