import request from 'supertest';
import express from 'express';

// Erstelle eine Mock Express App für Tests
export const createTestClient = () => {
  const app = express();
  app.use(express.json());
  
  // Füge hier deine Routes hinzu wenn nötig
  // app.use('/api/invitations', invitationRoutes);
  
  return request(app);
};

// Mock User für Tests
export const createMockUser = (role: 'DOM' | 'SUB') => {
  return {
    id: 'test-user-id',
    email: `test.${role.toLowerCase()}@example.com`,
    role,
    token: 'mock-jwt-token'
  };
};
