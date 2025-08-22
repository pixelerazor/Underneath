/**
 * Validation schema tests
 * 
 * Tests for Zod validation schemas used throughout the application.
 */

import {
  createInvitationSchema,
  validateInvitationSchema,
  acceptInvitationSchema
} from '../schemas/invitationSchemas';
import {
  registerSchema,
  loginSchema
} from '../schemas/authSchemas';

describe('Validation Schemas', () => {
  describe('Invitation Schemas', () => {
    describe('createInvitationSchema', () => {
      it('should accept valid invitation data', () => {
        const validData = {
          body: {
            email: 'test@example.com',
            message: 'Welcome to our platform!'
          }
        };

        const result = createInvitationSchema.safeParse(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.body.email).toBe('test@example.com');
          expect(result.data.body.message).toBe('Welcome to our platform!');
        }
      });

      it('should transform empty email to placeholder', () => {
        const dataWithEmptyEmail = {
          body: {
            email: '',
            message: 'Test message'
          }
        };

        const result = createInvitationSchema.safeParse(dataWithEmptyEmail);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.body.email).toMatch(/@invitation\.local$/);
        }
      });

      it('should reject invalid email formats', () => {
        const invalidData = {
          body: {
            email: 'not-an-email',
            message: 'Test'
          }
        };

        const result = createInvitationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject messages that are too long', () => {
        const longMessage = 'x'.repeat(501);
        const invalidData = {
          body: {
            email: 'test@example.com',
            message: longMessage
          }
        };

        const result = createInvitationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('validateInvitationSchema', () => {
      it('should accept valid invitation codes', () => {
        const validData = {
          body: {
            code: 'ABC12345'
          }
        };

        const result = validateInvitationSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject codes with wrong length', () => {
        const invalidData = {
          body: {
            code: 'SHORT'
          }
        };

        const result = validateInvitationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject codes with invalid characters', () => {
        const invalidData = {
          body: {
            code: 'abc12345' // lowercase not allowed
          }
        };

        const result = validateInvitationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('acceptInvitationSchema', () => {
      it('should accept valid acceptance data', () => {
        const validData = {
          body: {
            code: 'XYZ98765'
          }
        };

        const result = acceptInvitationSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Authentication Schemas', () => {
    describe('registerSchema', () => {
      it('should accept valid registration data', () => {
        const validData = {
          body: {
            email: 'newuser@example.com',
            password: 'SecurePass123!',
            confirmPassword: 'SecurePass123!',
            role: 'SUB' as const,
            displayName: 'Test User'
          }
        };

        const result = registerSchema.safeParse(validData);
        if (!result.success) {
          console.error('Validation errors:', result.error.errors);
        }
        expect(result.success).toBe(true);
      });

      it('should reject weak passwords', () => {
        const weakPasswordData = {
          body: {
            email: 'user@example.com',
            password: '123', // too weak
            confirmPassword: '123',
            role: 'SUB' as const
          }
        };

        const result = registerSchema.safeParse(weakPasswordData);
        expect(result.success).toBe(false);
      });

      it('should reject invalid email formats', () => {
        const invalidEmailData = {
          body: {
            email: 'not-an-email',
            password: 'SecurePass123!',
            confirmPassword: 'SecurePass123!',
            role: 'SUB' as const
          }
        };

        const result = registerSchema.safeParse(invalidEmailData);
        expect(result.success).toBe(false);
      });
    });

    describe('loginSchema', () => {
      it('should accept valid login data', () => {
        const validData = {
          body: {
            email: 'user@example.com',
            password: 'password123'
          }
        };

        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject missing email', () => {
        const invalidData = {
          body: {
            password: 'password123'
          }
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject missing password', () => {
        const invalidData = {
          body: {
            email: 'user@example.com'
          }
        };

        const result = loginSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });
});