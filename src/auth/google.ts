import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserService } from '../services/user.service';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userService = new UserService();



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userService.findOrCreateUser(profile);
        
        // Générer un JWT après la connexion réussie
        const payload = {
          user: user
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // Retourner le token comme partie de l'utilisateur
        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

