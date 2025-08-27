import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('🔍 DEBUG: Validating request data:', JSON.stringify({
        body: req.body,
        query: req.query,
        params: req.params
      }, null, 2));
      
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      console.log('✅ DEBUG: Validation passed');
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        console.log('❌ DEBUG: Validation failed:', JSON.stringify(errors, null, 2));
        
        res.status(400).json({
          error: 'Validation failed',
          errors: errors
        });
        return;
      }
      
      console.log('❌ DEBUG: Validation error (not Zod):', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};