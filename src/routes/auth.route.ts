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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Routes pour l'authentification
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Authentification via Google
 *     description: Redirige l'utilisateur vers Google pour l'authentification.
 *     responses:
 *       302:
 *         description: Redirection vers Google pour l'authentification.
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback pour l'authentification Google
 *     tags: [Auth]
 *     description: Callback pour gérer la réponse après l'authentification Google.
 *     responses:
 *       200:
 *         description: Succès de la connexion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     google_id:
 *                       type: string
 *                     email:
 *                       type: string
 */
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

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le token d'accès
 *     tags: [Auth]
 *     description: Utilise un token de rafraîchissement pour générer un nouveau token d'accès.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Le token de rafraîchissement
 *     responses:
 *       200:
 *         description: Nouveau token d'accès généré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Token de rafraîchissement manquant.
 *       403:
 *         description: Token de rafraîchissement invalide ou expiré.
 */
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

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Déconnexion
 *     tags: [Auth]
 *     description: Déconnecte l'utilisateur et redirige vers la page d'accueil.
 *     responses:
 *       302:
 *         description: Redirection vers la page d'accueil après la déconnexion.
 */
router.get('/logout', (req: Request, res: Response, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;
