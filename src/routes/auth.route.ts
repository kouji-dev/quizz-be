import passport from 'passport';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();

// Démarrer l'authentification Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route de callback après authentification Google

// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req: any, res) => {
//     //TODO: send token as queryParam
//   res.redirect(`com.quiz.demo://?first_name=${req.user.first_name}/last_name=${req.user.last_name}/email=${req.user.email}`); // Redirection après succès
// });

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req: any, res) => {
    const token = jwt.sign(req.user, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Vérifier si la requête est envoyée depuis une application mobile
    const isMobileApp = req.headers['user-agent']?.includes('Mobile') || req.query.isMobile === 'true';

    if (isMobileApp) {
      // Redirection vers l'application mobile avec le token
      res.redirect(`com.quiz.demo://?token=${token}`);
    } else {
      // Répondre en JSON pour les navigateurs web
      res.json({
        message: 'Connexion réussie',
        user: req.user,
      });
    }
  }
);




// Route de déconnexion
router.get('/logout', (req: Request, res: Response, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

export default router;
