import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const jwtIsAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Non authentifié. Veuillez fournir un token.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!);

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
  }
};
