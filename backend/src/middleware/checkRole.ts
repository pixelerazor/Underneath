// backend/src/middleware/checkRole.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';

type UserRole = 'DOM' | 'SUB' | 'OBSERVER' | 'ADMIN';

export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('🔍 DEBUG: checkRole middleware - User info:', { userId: req.user?.userId, role: req.user?.role, allowedRoles });
    
    if (!req.user) {
      console.log('❌ DEBUG: No user in request');
      throw new CustomError('UNAUTHORIZED', 'Nicht authentifiziert');
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ DEBUG: Role not allowed:', { userRole: req.user.role, allowedRoles });
      throw new CustomError('FORBIDDEN', 'Keine Berechtigung für diese Aktion');
    }

    console.log('✅ DEBUG: Role check passed');
    next();
  };
};