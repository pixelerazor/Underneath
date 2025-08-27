/**
 * Privilegien Service
 * 
 * Service for managing privileges and special rights
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { apiClient } from './apiClient';

export interface PrivilegienData {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  conditions?: string;
  duration?: string;
  pointsRequired?: number;
  level?: number;
  canRevoke?: boolean;
  autoExpires?: boolean;
  expiresAfter?: string;
  activeFromStage?: number;
  activeToStage?: number;
  grantedToId?: string;
  creatorId?: string;
  stageId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class PrivilegienService {
  /**
   * Get all privilegien
   */
  async getAllPrivilegien(params?: { activeFromStage?: number }): Promise<PrivilegienData[]> {
    const queryParams = new URLSearchParams();
    if (params?.activeFromStage) {
      queryParams.append('activeFromStage', params.activeFromStage.toString());
    }
    
    const response = await apiClient.get(`/privilegien?${queryParams.toString()}`);
    return response.data.data;
  }

  /**
   * Get privileg by ID
   */
  async getPrivilegById(id: string): Promise<PrivilegienData> {
    const response = await apiClient.get(`/privilegien/${id}`);
    return response.data.data;
  }

  /**
   * Create new privileg - using createEntry to match other services
   */
  async createEntry(data: Omit<PrivilegienData, 'id' | 'createdAt' | 'updatedAt' | 'creatorId'>): Promise<PrivilegienData> {
    const response = await apiClient.post('/privilegien', data);
    return response.data.data;
  }

  /**
   * Create new privileg (alias for createEntry)
   */
  async createPrivileg(data: Omit<PrivilegienData, 'id' | 'createdAt' | 'updatedAt' | 'creatorId'>): Promise<PrivilegienData> {
    return this.createEntry(data);
  }

  /**
   * Update existing privileg
   */
  async updatePrivileg(id: string, data: Partial<PrivilegienData>): Promise<PrivilegienData> {
    const response = await apiClient.put(`/privilegien/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete privileg
   */
  async deletePrivileg(id: string): Promise<void> {
    await apiClient.delete(`/privilegien/${id}`);
  }
}

export const privilegienService = new PrivilegienService();