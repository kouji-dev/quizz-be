import passport from 'passport';
import { db } from '../db/database';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserService } from '../services/user.service';
import { eq } from 'drizzle-orm/expressions';
import { users } from '../db/schemas/users';
import dotenv from 'dotenv';

dotenv.config();

const userService = new UserService();

// Configurer la stratégie Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK!,
}, async (accessToken, refreshToken, profile, done) => {
  console.log({profile})
  try {
    const user = await userService.findOrCreateUser(profile);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userId = Number(id); // Convertir l'ID en nombre
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    done(null, user[0]); // Utiliser le premier élément du tableau
  } catch (error) {
    done(error);
  }
});

