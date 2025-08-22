import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address')
      .min(5, 'Email too short')
      .max(255, 'Email too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase and number'
      ),
    role: z.enum(['DOM', 'SUB', 'OBSERVER'], {
      required_error: 'Role is required',
      invalid_type_error: 'Invalid role'
    })
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
  })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];