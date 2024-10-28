import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import examRoutes from './routes/exam.route';

import passport from 'passport';
import './auth/google';



const app = express();

// Configurer les sessions
// app.use(session({
//   secret: process.env.SESSION_SECRET!,
//   resave: false,
//   saveUninitialized: false,
// }));

//TODO: add redirects: 'com.quiz.demo', maybe google auth
app.use(
    cors({
      origin: '*', // Allow your Expo app's scheme
      credentials: true,
    })
);

// Initialiser Passport.js
app.use(passport.initialize());
//app.use(passport.session());

// Pour traiter les données JSON dans les requêtes
app.use(express.json());

// Utiliser les routes d'authentification
app.use('/auth', authRoutes);

// Utiliser les routes pour gérer les utilisateurs et les examens
app.use('/api', userRoutes);

app.use('/api', examRoutes);


const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
