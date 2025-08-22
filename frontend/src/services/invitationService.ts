import { AxiosResponse } from 'axios';
import api from './authService';

export interface Invitation {
  id: string;
  code: string;
  email: string;
  message?: string;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  emailSent?: boolean; // Optional field für E-Mail Status
}

export interface Connection {
  id: string;
  domId: string;
  subId: string;
  createdAt: Date;
  domProfile: {
    displayName: string;
  };
  subProfile: {
    displayName: string;
  };
}

export const invitationService = {
  // Für Doms
  createInvitation: async (email: string, message?: string): Promise<Invitation> => {
    const response: AxiosResponse<Invitation> = await api.post('/invitations/create', {
      email,
      message,
    });
    return response.data;
  },

  getMyInvitations: async (): Promise<Invitation[]> => {
    const response: AxiosResponse<Invitation[]> = await api.get('/invitations/my');
    return response.data;
  },

  // Für Subs
  validateCode: async (code: string): Promise<{ 
    isValid: boolean;
    invitation?: Invitation;
  }> => {
    const response = await api.post('/invitations/validate', { code });
    return response.data;
  },

  acceptInvitation: async (code: string): Promise<{
    success: boolean;
    connection?: Connection;
  }> => {
    const response = await api.post('/invitations/accept', { code });
    return response.data;
  },

  // Für beide
  getMyConnections: async (): Promise<Connection[]> => {
    const response: AxiosResponse<Connection[]> = await api.get('/connections');
    return response.data;
  },
};
