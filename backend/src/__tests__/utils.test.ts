/**
 * Utility Functions Tests
 * 
 * Tests for validation utilities and other helper functions.
 */

import {
  isValidEmail,
  validatePassword,
  isValidInvitationCode,
  isValidRole,
  sanitizeInput,
  validateDisplayName,
  validateMessage
} from '../utils/validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user.example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept strong passwords', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const weakPassword = validatePassword('weak');
      expect(weakPassword.isValid).toBe(false);
      expect(weakPassword.errors.length).toBeGreaterThan(0);
    });

    it('should require all password criteria', () => {
      // Missing uppercase
      const noUpper = validatePassword('lowercase123!');
      expect(noUpper.isValid).toBe(false);
      expect(noUpper.errors).toContain('Password must contain at least one uppercase letter');

      // Missing lowercase  
      const noLower = validatePassword('UPPERCASE123!');
      expect(noLower.isValid).toBe(false);
      expect(noLower.errors).toContain('Password must contain at least one lowercase letter');

      // Missing digit
      const noDigit = validatePassword('Password!');
      expect(noDigit.isValid).toBe(false);
      expect(noDigit.errors).toContain('Password must contain at least one digit');

      // Missing special character
      const noSpecial = validatePassword('Password123');
      expect(noSpecial.isValid).toBe(false);
      expect(noSpecial.errors).toContain('Password must contain at least one special character (@$!%*?&)');

      // Too short
      const tooShort = validatePassword('Pass1!');
      expect(tooShort.isValid).toBe(false);
      expect(tooShort.errors).toContain('Password must be at least 8 characters long');
    });
  });

  describe('isValidInvitationCode', () => {
    it('should validate correct invitation codes', () => {
      expect(isValidInvitationCode('ABCD1234')).toBe(true);
      expect(isValidInvitationCode('XYZ98765')).toBe(true);
      expect(isValidInvitationCode('12345678')).toBe(true);
    });

    it('should reject invalid invitation codes', () => {
      expect(isValidInvitationCode('abcd1234')).toBe(false); // lowercase
      expect(isValidInvitationCode('ABCD123')).toBe(false);  // too short
      expect(isValidInvitationCode('ABCD12345')).toBe(false); // too long
      expect(isValidInvitationCode('ABCD!234')).toBe(false);  // special character
      expect(isValidInvitationCode('')).toBe(false);          // empty
    });
  });

  describe('isValidRole', () => {
    it('should validate correct roles', () => {
      expect(isValidRole('DOM')).toBe(true);
      expect(isValidRole('SUB')).toBe(true);
      expect(isValidRole('OBSERVER')).toBe(true);
      expect(isValidRole('ADMIN')).toBe(true);
      expect(isValidRole('dom')).toBe(true); // case insensitive
    });

    it('should reject invalid roles', () => {
      expect(isValidRole('INVALID')).toBe(false);
      expect(isValidRole('USER')).toBe(false);
      expect(isValidRole('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous script tags', () => {
      const dangerous = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(dangerous);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
    });

    it('should remove dangerous characters', () => {
      const dangerous = '<>"\'test';
      const sanitized = sanitizeInput(dangerous);
      expect(sanitized).toBe('test');
    });

    it('should preserve safe content', () => {
      const safe = 'This is a safe message with numbers 123 and spaces';
      const sanitized = sanitizeInput(safe);
      expect(sanitized).toBe(safe);
    });
  });

  describe('validateDisplayName', () => {
    it('should accept valid display names', () => {
      const result = validateDisplayName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept names with allowed characters', () => {
      const result = validateDisplayName('User_123-Test.Name');
      expect(result.isValid).toBe(true);
    });

    it('should reject names that are too short', () => {
      const result = validateDisplayName('A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Display name must be at least 2 characters long');
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(51);
      const result = validateDisplayName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Display name must not exceed 50 characters');
    });

    it('should reject names with invalid characters', () => {
      const result = validateDisplayName('Invalid@Name#');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Display name can only contain letters, numbers, spaces, dots, underscores, and hyphens');
    });
  });

  describe('validateMessage', () => {
    it('should accept valid messages', () => {
      const result = validateMessage('Welcome to our platform!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject messages that are too long', () => {
      const longMessage = 'A'.repeat(501);
      const result = validateMessage(longMessage);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Message must not exceed 500 characters');
    });

    it('should reject potentially dangerous content', () => {
      const dangerous1 = validateMessage('Click here: <script>alert("xss")</script>');
      expect(dangerous1.isValid).toBe(false);
      expect(dangerous1.errors).toContain('Message contains potentially dangerous content');

      const dangerous2 = validateMessage('Go to: javascript:alert("xss")');
      expect(dangerous2.isValid).toBe(false);
      expect(dangerous2.errors).toContain('Message contains potentially dangerous content');
    });
  });
});