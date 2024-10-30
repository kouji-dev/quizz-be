import passport from 'passport';
import express, { Request, Response } from 'express';


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
  passport.authenticate('google', { failureRedirect: '/', session: false }), // Désactiver les sessions ici
  (req: any, res) => {
    const { token, user } = req.user;

    res.json({
      message: 'Connexion réussie',
      token,
      user,
    });
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
