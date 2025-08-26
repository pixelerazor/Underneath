/**
 * Stage Sub Settings Service
 * 
 * Manages Sub-specific settings for stages (active, visible, locked status)
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { apiClient } from './apiClient';

export interface StageSubSettings {
  id: string;
  stageId: string;
  isSubActive: boolean;
  isSubVisible: boolean;
  isSubLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StageSubSettingsUpdate {
  isSubActive?: boolean;
  isSubVisible?: boolean;
  isSubLocked?: boolean;
}

export interface StageWithSubSettings {
  id: string;
  stageNumber: number;
  name: string;
  description?: string;
  pointsRequired: number;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subSettings: StageSubSettings;
}

class StageSubSettingsService {
  private readonly baseUrl = '/stage-sub-settings';

  /**
   * Get all stages with their Sub settings
   */
  async getAllStagesWithSubSettings(): Promise<StageWithSubSettings[]> {
    const response = await apiClient.get(`${this.baseUrl}/stages-with-settings`);
    return response.data.data || [];
  }

  /**
   * Get Sub settings for a specific stage
   */
  async getStageSubSettings(stageId: string): Promise<StageSubSettings> {
    const response = await apiClient.get(`${this.baseUrl}/stage/${stageId}`);
    return response.data.data;
  }

  /**
   * Update Sub settings for a stage
   */
  async updateStageSubSettings(stageId: string, settings: StageSubSettingsUpdate): Promise<StageSubSettings> {
    const response = await apiClient.put(`${this.baseUrl}/stage/${stageId}`, settings);
    return response.data.data;
  }

  /**
   * Toggle Sub active status for a stage
   */
  async toggleSubActive(stageId: string): Promise<StageSubSettings> {
    const response = await apiClient.patch(`${this.baseUrl}/stage/${stageId}/toggle-active`);
    return response.data.data;
  }

  /**
   * Toggle Sub visible status for a stage
   */
  async toggleSubVisible(stageId: string): Promise<StageSubSettings> {
    const response = await apiClient.patch(`${this.baseUrl}/stage/${stageId}/toggle-visible`);
    return response.data.data;
  }

  /**
   * Toggle Sub locked status for a stage
   */
  async toggleSubLocked(stageId: string): Promise<StageSubSettings> {
    const response = await apiClient.patch(`${this.baseUrl}/stage/${stageId}/toggle-locked`);
    return response.data.data;
  }

  /**
   * Get all stages that are Sub active (for "Aktuelle Stufe" view)
   */
  async getSubActiveStages(): Promise<StageWithSubSettings[]> {
    const response = await apiClient.get(`${this.baseUrl}/sub-active-stages`);
    return response.data.data || [];
  }

  /**
   * Bulk update Sub settings for multiple stages
   */
  async bulkUpdateSubSettings(updates: { stageId: string; settings: StageSubSettingsUpdate }[]): Promise<StageSubSettings[]> {
    const response = await apiClient.put(`${this.baseUrl}/bulk-update`, { updates });
    return response.data.data || [];
  }
}

export const stageSubSettingsService = new StageSubSettingsService();