/**
 * Authentication system tests
 * 
 * Tests for authentication middleware, JWT handling, and auth-related utilities.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';

describe('Authentication System', () => {
  describe('JWT Token Handling', () => {
    const secret = process.env.JWT_SECRET!;
    
    it('should generate and verify valid JWT tokens', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'DOM' };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = jwt.verify(token, secret) as any;
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it('should reject invalid tokens', () => {
      const invalidToken = 'invalid-token';
      
      expect(() => {
        jwt.verify(invalidToken, secret);
      }).toThrow();
    });

    it('should reject expired tokens', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'DOM' };
      const expiredToken = jwt.sign(payload, secret, { expiresIn: '-1h' });
      
      expect(() => {
        jwt.verify(expiredToken, secret);
      }).toThrow('jwt expired');
    });
  });

  describe('Password Hashing', () => {
    it('should hash passwords securely', async () => {
      const plainPassword = 'testPassword123!';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should verify hashed passwords correctly', async () => {
      const plainPassword = 'testPassword123!';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      const isInvalid = await bcrypt.compare('wrongPassword', hashedPassword);
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Authentication Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
      mockRequest = {
        headers: {}
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      nextFunction = jest.fn();
    });

    it('should reject requests without authorization header', () => {
      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Access token required' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject requests with invalid tokens', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token'
      };
      
      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid access token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should accept valid tokens and set user in request', () => {
      const payload = { userId: '123', email: 'test@example.com', role: 'DOM' };
      const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
      
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };
      
      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.user).toEqual(expect.objectContaining(payload));
    });
  });

  describe('Role Authorization Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      nextFunction = jest.fn();
    });

    it('should reject requests without authenticated user', () => {
      const roleMiddleware = authorizeRole(['DOM']);
      roleMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Authentication required' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject users with insufficient permissions', () => {
      mockRequest.user = { userId: '123', email: 'test@example.com', role: 'SUB' };
      
      const roleMiddleware = authorizeRole(['DOM']);
      roleMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should allow users with correct permissions', () => {
      mockRequest.user = { userId: '123', email: 'test@example.com', role: 'DOM' };
      
      const roleMiddleware = authorizeRole(['DOM', 'ADMIN']);
      roleMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
      
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});