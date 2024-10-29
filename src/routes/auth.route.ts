import passport from 'passport';
import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Démarrer l'authentification Google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Route de callback après authentification Google
router.get(
    '/google/callback',
    passport.authenticate('google', {failureRedirect: '/', session: false}), // Désactiver les sessions ici
    (req: any, res) => {
        // Générer un JWT après la connexion réussie
        const token = jwt.sign(req.user, process.env.JWT_SECRET!, {expiresIn: '1h'});
        res.redirect(`com.quiz.demo://?token=${token}`); // Redirection après succès
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
