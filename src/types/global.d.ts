// src/types/global.d.ts

import { User as PassportUser } from 'passport';

declare global {
  namespace Express {
    interface User extends PassportUser {
      id: number;
      email: string;
      firstName?: string;
    }

    interface Request {
      user?: User | undefined;
    }
  }
}
