describe('Simple Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
  
  it('should test environment', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
