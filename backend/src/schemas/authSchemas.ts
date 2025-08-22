/**
 * Authentication validation schemas
 * 
 * Zod schemas for validating authentication-related requests.
 */

import { z } from 'zod';

/**
 * User registration schema
 * Validates email, password, confirmation, and role
 */
export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email format')
      .min(5, 'Email too short')
      .max(255, 'Email too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one lowercase letter, uppercase letter, number, and special character'
      ),
    confirmPassword: z.string(),
    role: z.enum(['DOM', 'SUB', 'OBSERVER'], {
      errorMap: () => ({ message: 'Role must be DOM, SUB, or OBSERVER' })
    }),
    displayName: z
      .string()
      .min(2, 'Display name must be at least 2 characters')
      .max(50, 'Display name too long')
      .optional()
  }).refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    }
  )
});

/**
 * User login schema
 * Validates email and password
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email format')
      .min(1, 'Email is required'),
    password: z
      .string()
      .min(1, 'Password is required')
  })
});

/**
 * Token refresh schema
 * Validates refresh token
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string()
      .min(1, 'Refresh token is required')
  })
});

/**
 * Password change schema
 * Validates current password, new password, and confirmation
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .max(100, 'Password too long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one lowercase letter, uppercase letter, number, and special character'
      ),
    confirmNewPassword: z.string()
  }).refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
      message: 'New passwords do not match',
      path: ['confirmNewPassword']
    }
  )
});

/**
 * Logout schema
 * Validates optional refresh token
 */
export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional()
  })
});

// Type exports for TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;