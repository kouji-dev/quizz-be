import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import {db} from './db/database';
import { sql } from 'drizzle-orm';
import passport from 'passport';
import './auth/google';



const app = express();

// Configurer les sessions
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
}));

// Initialiser Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Pour traiter les données JSON dans les requêtes
app.use(express.json());

// Utiliser les routes d'authentification
app.use('/auth', authRoutes);

// Utiliser les routes pour gérer les utilisateurs et les examens
app.use('/api', userRoutes);

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});


// app.get('/', async (req, res) => {
//   const name = process.env.NAME || 'World';
//   const result = await db.execute(sql`SELECT NOW()`);
//   res.send(result);
// });


const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
