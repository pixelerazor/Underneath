// backend/src/middleware/rateLimiter.ts
import rateLimit, { Options } from 'express-rate-limit';
import { logger } from '../utils/logger';

interface RateLimitConfig extends Partial<Options> {
  windowMs: number;
  max: number;
  message?: string;
}

export const rateLimiter = (config: RateLimitConfig) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: { error: config.message || 'Zu viele Anfragen. Bitte später erneut versuchen.' },
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP ${req.ip}`);
      res.status(429).json(options.message);
    },
    ...config,
  });
};