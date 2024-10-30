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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (typeof decoded === 'object' && 'user' in decoded) {
      req.user = (decoded as any).user; // Assigner directement l'objet interne `user`
    } else {
      req.user = decoded as Partial<UserDTO>;
    }
  
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré. Veuillez vous reconnecter.' });
  }
};
