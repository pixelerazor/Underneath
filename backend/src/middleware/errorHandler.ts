// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof CustomError) {
    return res.status(400).json({
      error: error.message,
      code: error.code,
    });
  }

  res.status(500).json({
    error: 'Ein interner Fehler ist aufgetreten',
  });
};