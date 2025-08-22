/**
 * Jest test setup configuration
 * 
 * This file is loaded before each test suite runs.
 * Used for global test configuration and environment setup.
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Set default test environment variables if not present
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-purposes-only';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./test.db';
}

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // Only show errors in tests unless specifically testing logging
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

export {};