import passport from 'passport';
import express, { Request, Response } from 'express';


const router = express.Router();

// Démarrer l'authentification Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route de callback après authentification Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req: any, res) => {
    //TODO: send token as queryParam
  res.redirect(`com.quiz.demo://?firstName=${req.user.firstName}/lastName=${req.user.lastName}/email=${req.user.email}`); // Redirection après succès
});

// Route de déconnexion
router.get('/logout', (req: Request, res: Response, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

export default router;
