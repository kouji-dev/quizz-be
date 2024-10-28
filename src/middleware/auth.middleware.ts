import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const jwtIsAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // Vérifier si le token est présent dans l'en-tête Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Non authentifié. Veuillez fournir un token.' });
    return; // Assurez-vous d'arrêter l'exécution ici
  }

  // Extraire le token de l'en-tête
  const token = authHeader.split(' ')[1];

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Ajouter les informations du token décodé à la requête (par exemple, l'ID de l'utilisateur)
    req.user = decoded;

    // Continuer vers le prochain middleware ou la route
    next();
  } catch (error) {
    // Si le token est invalide ou expiré, envoyer une réponse 401
    res.status(401).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
    return; // Assurez-vous d'arrêter l'exécution ici aussi
  }
};
