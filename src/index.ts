import express, { application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import examRoutes from './routes/exam.route';
import categoryRoutes from './routes/category.route';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);

app.use('/api', userRoutes);

app.use('/api', examRoutes);

app.use('/api', categoryRoutes);


const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
