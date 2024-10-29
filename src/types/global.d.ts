// src/types/global.d.ts

declare namespace Express {
  interface User {
    id: number;
    email: string;
    name?: string;
  }

  interface Request {
    user?: User;
  }
}
