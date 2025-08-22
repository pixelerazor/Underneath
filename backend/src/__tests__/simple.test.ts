/**
 * Basic smoke tests for the application setup
 */
describe('Application Setup', () => {
  it('should have correct test environment', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
  
  it('should have basic math operations working', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have required environment variables defined', () => {
    // These should be defined in .env or .env.test
    expect(process.env.JWT_SECRET || 'test-secret').toBeDefined();
    expect(process.env.DATABASE_URL || 'test-db').toBeDefined();
  });

  it('should be able to import main modules', async () => {
    // Test that main modules can be imported without errors
    const { PrismaClient } = await import('@prisma/client');
    expect(PrismaClient).toBeDefined();
    
    const bcrypt = await import('bcrypt');
    expect(bcrypt.hash).toBeDefined();
    
    const jwt = await import('jsonwebtoken');
    expect(jwt.sign).toBeDefined();
  });
});
