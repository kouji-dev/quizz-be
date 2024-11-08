import passport from 'passport';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Fonction pour générer les tokens
const generateTokens = (user: any) => {
  const accessToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1h' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Fonction pour vérifier et décoder le token
const verifyAndDecodeToken = (token: string, secret: string): any => {
  const decoded = jwt.verify(token, secret);
  return typeof decoded === 'object' && 'user' in decoded ? (decoded as any).user : decoded;
};

// Démarrer l'authentification Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route de callback après authentification Google
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req: any, res) => {
    const { accessToken, refreshToken } = generateTokens(req.user);

    // Vérifier si la requête est envoyée depuis une application mobile
    const isMobileApp = req.headers['user-agent']?.includes('Mobile') || req.query.isMobile === 'true';

    if (isMobileApp) {
      // Redirection vers l'application mobile avec le token d'accès et de refresh
      const loginLink = process.env.APP_LOGIN_LINK!;
      res.redirect('${loginLink}?access_token=${accessToken}&refresh_token=${refreshToken}');
    } 

    else {
      // Répondre en JSON pour les navigateurs web
      res.json({
        message: 'Connexion réussie',
        accessToken,
        refreshToken,
        user: req.user,
      });
    }
  }
);

router.post('/refresh-token', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Token de rafraîchissement manquant' });
  }

  if (!process.env.JWT_SECRET || !process.env.REFRESH_SECRET) {
    throw new Error('Les secrets JWT ne sont pas définis.');
  }

  try {
    // Vérifier et décoder le refresh token
    const decodedUser = verifyAndDecodeToken(refreshToken, process.env.REFRESH_SECRET!);

    // Générer un nouveau token d'accès
    const newAccessToken = jwt.sign(
      { id: decodedUser.id, google_id: decodedUser.google_id, email: decodedUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Token de rafraîchissement invalide ou expiré' });
  }
});

// Route de déconnexion
router.get('/logout', (req: Request, res: Response, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;
