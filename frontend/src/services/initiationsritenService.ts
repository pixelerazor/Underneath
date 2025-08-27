/**
 * Initiationsriten Service
 * 
 * Service for managing initiation rituals
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { apiClient } from './apiClient';

export interface InitiationsritenData {
  id?: string;
  title: string;
  description?: string;
  ritualType?: string;
  markingType?: string;
  bodyLocation?: string;
  symbolism?: string;
  actionSequence?: string;
  symbolMeaning?: string;
  repetitionSchedule?: string;
  ceremonyLocation?: string;
  participants?: string;
  ceremonyDuration?: string;
  ceremonyElements?: string;
  behaviorDescription?: string;
  behaviorDuration?: string;
  behaviorFrequency?: string;
  customDefinition?: string;
  timing?: string;
  documentation?: string;
  requiresPreparation?: boolean;
  requiresAftercare?: boolean;
  preparationDetails?: string;
  aftercareDetails?: string;
  explicitConsent?: boolean;
  hardLimits?: string;
  exitClause?: string;
  medicalConsiderations?: string;
  reversibility?: string;
  reversibilityDetails?: string;
  activeFromStage?: number;
  activeToStage?: number;
  creatorId?: string;
  stageId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class InitiationsritenService {
  /**
   * Get all initiationsriten
   */
  async getAllInitiationsriten(params?: { activeFromStage?: number }): Promise<InitiationsritenData[]> {
    const queryParams = new URLSearchParams();
    if (params?.activeFromStage) {
      queryParams.append('activeFromStage', params.activeFromStage.toString());
    }
    
    const response = await apiClient.get(`/initiationsriten?${queryParams.toString()}`);
    return response.data.data;
  }

  /**
   * Get initiationsriten by ID
   */
  async getInitiationsritenById(id: string): Promise<InitiationsritenData> {
    const response = await apiClient.get(`/initiationsriten/${id}`);
    return response.data.data;
  }

  /**
   * Create new initiationsriten - using createEntry to match other services
   */
  async createEntry(data: Omit<InitiationsritenData, 'id' | 'createdAt' | 'updatedAt' | 'creatorId'>): Promise<InitiationsritenData> {
    const response = await apiClient.post('/initiationsriten', data);
    return response.data.data;
  }

  /**
   * Create new initiationsriten (alias for createEntry)
   */
  async createInitiationsriten(data: Omit<InitiationsritenData, 'id' | 'createdAt' | 'updatedAt' | 'creatorId'>): Promise<InitiationsritenData> {
    return this.createEntry(data);
  }

  /**
   * Update existing initiationsriten
   */
  async updateInitiationsriten(id: string, data: Partial<InitiationsritenData>): Promise<InitiationsritenData> {
    const response = await apiClient.put(`/initiationsriten/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete initiationsriten
   */
  async deleteInitiationsriten(id: string): Promise<void> {
    await apiClient.delete(`/initiationsriten/${id}`);
  }
}

export const initiationsritenService = new InitiationsritenService();