// drizzle.config.ts
import { config } from 'dotenv';
config(); // Charger les variables d'environnement

export default {
  schema: './db/index.ts',  // Chemin vers ton fichier de schéma Drizzle ORM
  out: './migrations',       // Répertoire où seront enregistrées les migrations
  connectionString: process.env.DATABASE_URL,  // URL de connexion à PostgreSQL (via Supabase)
};