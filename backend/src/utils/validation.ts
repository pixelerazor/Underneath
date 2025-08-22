/**
 * Validation Utilities
 * 
 * Common validation functions used throughout the application.
 * Provides reusable validation logic for various data types.
 * 
 * @module ValidationUtils
 * @author Underneath Team
 * @version 1.0.0
 */

/**
 * Validates email format using a comprehensive regex pattern
 * 
 * @param email - Email address to validate
 * @returns boolean - True if email format is valid
 * 
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength requirements
 * 
 * Requirements:
 * - At least 8 characters long
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one digit
 * - Contains at least one special character
 * 
 * @param password - Password to validate
 * @returns object - Validation result with details
 * 
 * @example
 * validatePassword('SecurePass123!') 
 * // { isValid: true, errors: [] }
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one digit');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates invitation code format
 * 
 * Requirements:
 * - Exactly 8 characters
 * - Only uppercase letters and numbers
 * - No special characters or spaces
 * 
 * @param code - Invitation code to validate
 * @returns boolean - True if code format is valid
 * 
 * @example
 * isValidInvitationCode('ABCD1234') // true
 * isValidInvitationCode('abc123') // false
 */
export function isValidInvitationCode(code: string): boolean {
  const codeRegex = /^[A-Z0-9]{8}$/;
  return codeRegex.test(code);
}

/**
 * Validates user role
 * 
 * @param role - User role to validate
 * @returns boolean - True if role is valid
 * 
 * @example
 * isValidRole('DOM') // true
 * isValidRole('invalid') // false
 */
export function isValidRole(role: string): boolean {
  const validRoles = ['DOM', 'SUB', 'OBSERVER', 'ADMIN'];
  return validRoles.includes(role.toUpperCase());
}

/**
 * Sanitizes user input by removing dangerous characters
 * 
 * @param input - String to sanitize
 * @returns string - Sanitized string
 * 
 * @example
 * sanitizeInput('<script>alert("xss")</script>') 
 * // 'scriptalert("xss")/script'
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>'"]/g, '')
    .trim();
}

/**
 * Validates display name format
 * 
 * @param displayName - Display name to validate
 * @returns object - Validation result with details
 * 
 * @example
 * validateDisplayName('John Doe') 
 * // { isValid: true, errors: [] }
 */
export function validateDisplayName(displayName: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (displayName.length < 2) {
    errors.push('Display name must be at least 2 characters long');
  }
  
  if (displayName.length > 50) {
    errors.push('Display name must not exceed 50 characters');
  }
  
  if (!/^[a-zA-Z0-9\s._-]+$/.test(displayName)) {
    errors.push('Display name can only contain letters, numbers, spaces, dots, underscores, and hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates message content (for invitations, etc.)
 * 
 * @param message - Message to validate
 * @returns object - Validation result with details
 * 
 * @example
 * validateMessage('Welcome to the platform!') 
 * // { isValid: true, errors: [] }
 */
export function validateMessage(message: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (message.length > 500) {
    errors.push('Message must not exceed 500 characters');
  }
  
  // Check for potentially dangerous content
  if (message.includes('<script>') || message.includes('javascript:')) {
    errors.push('Message contains potentially dangerous content');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}