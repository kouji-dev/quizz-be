import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../dto/user.dto';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Partial<UserDTO>; // Pour permettre `id`, `email`, etc.
  }
}

export const jwtIsAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Non authentifié. Veuillez fournir un token.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Typage du token décodé pour correspondre à `UserDTO`
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Assigner les informations décodées à `req.user`
    req.user = decoded;

    // Continuer vers le prochain middleware ou la route
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
  }
};
