import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerOptions } from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000; // Définit un port par défaut au cas où il n'est pas dans .env

const swaggerOptions: SwaggerOptions = {
  definition: {
    info: {
      
      title: 'QUIZ CODE V1',
      version: '1.0.0',
      description: 'Documentation for the QUIZ APP API V1',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // Utilise le port depuis .env
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'https',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Spécifie le format JWT
          description: 'Entrez votre token JWT pour vous authentifier',
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Applique l'authentification par défaut à toutes les routes si nécessaire
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Chemin vers les fichiers d'annotations Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
