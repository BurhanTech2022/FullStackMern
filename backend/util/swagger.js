import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Transactions API',
      version: '1.0.0',
      description: 'API documentation for our transaction manager'
    },
    servers: [
      {
        url: 'http://localhost:4000/api'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Corrected path using absolute reference
  apis: [path.join(__dirname, '../routes/*.js')]
};

export const swaggerSpec = swaggerJSDoc(options);