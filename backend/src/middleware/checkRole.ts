// backend/src/middleware/checkRole.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';

type UserRole = 'DOM' | 'SUB' | 'OBSERVER' | 'ADMIN';

export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('UNAUTHORIZED', 'Nicht authentifiziert');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new CustomError('FORBIDDEN', 'Keine Berechtigung für diese Aktion');
    }

    next();
  };
};