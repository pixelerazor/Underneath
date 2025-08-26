import { EntityService } from './core/EntityService';
import { log } from '../utils/logger';

// Types
export interface Stage {
  id: string;
  stageNumber: number;
  name: string;
  description?: string;
  pointsRequired: number;
  color?: string;
  isActive: boolean;
  // Sub settings - stored directly in stages table for now
  isSubActive?: boolean;
  isSubVisible?: boolean;
  isSubLocked?: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
    rules: number;
    goals: number;
    progressions: number;
  };
}

export interface CreateStageData {
  stageNumber: number;
  name: string;
  description?: string;
  pointsRequired: number;
  color?: string;
}

export interface UpdateStageData {
  name?: string;
  description?: string;
  pointsRequired?: number;
  color?: string;
  isSubActive?: boolean;
  isSubVisible?: boolean;
  isSubLocked?: boolean;
}

class StageServiceImpl extends EntityService<Stage, CreateStageData, UpdateStageData> {
  protected readonly endpoint = '/stages';

  // Create a new stage
  async createStage(data: CreateStageData): Promise<Stage> {
    return this.create(data);
  }

  // Get all stages
  async getAllStages(): Promise<Stage[]> {
    try {
      const response = await this.getAll();
      const stages = response.items;
      
      // Add Sub settings from localStorage to each stage
      return stages.map(stage => ({
        ...stage,
        ...this.getSubSettings(stage.id)
      }));
    } catch (error) {
      log.error('StageService', 'Failed to get all stages', error instanceof Error ? error : new Error(String(error)));
      // Return empty array as fallback
      return [];
    }
  }

  // Get stage by ID
  async getStageById(stageId: string): Promise<Stage> {
    const stage = await this.getById(stageId);
    
    // Add Sub settings from localStorage
    return {
      ...stage,
      ...this.getSubSettings(stage.id)
    };
  }

  // Get stage by stage number
  async getStageByNumber(stageNumber: number): Promise<Stage> {
    const stage = await this.get<Stage>(`/number/${stageNumber}`);
    
    // Add Sub settings from localStorage
    return {
      ...stage,
      ...this.getSubSettings(stage.id)
    };
  }

  // Update stage
  async updateStage(stageId: string, data: UpdateStageData): Promise<Stage> {
    return this.update(stageId, data);
  }

  // Delete stage
  async deleteStage(stageId: string): Promise<{ success: boolean; message: string }> {
    return this.remove(stageId);
  }

  // Toggle stage status (active/inactive)
  async toggleStageStatus(stageId: string): Promise<Stage> {
    return this.patch<Stage>(`/${stageId}/toggle`, {});
  }

  // Get stage statistics
  async getStageStatistics(): Promise<any> {
    return this.get<any>('/statistics');
  }

  // Initialize default stages
  async initializeDefaultStages(): Promise<{ message: string; stages?: Stage[] }> {
    return this.post<{ message: string; stages?: Stage[] }>('/initialize', {});
  }

  // Sub Settings Methods (Temporary localStorage fallback until backend is implemented)
  
  private getSubSettings(stageId: string): { isSubActive: boolean; isSubVisible: boolean; isSubLocked: boolean } {
    const settings = localStorage.getItem(`subSettings_${stageId}`);
    return settings ? JSON.parse(settings) : { isSubActive: false, isSubVisible: true, isSubLocked: false };
  }

  private setSubSettings(stageId: string, settings: { isSubActive?: boolean; isSubVisible?: boolean; isSubLocked?: boolean }) {
    const current = this.getSubSettings(stageId);
    const updated = { ...current, ...settings };
    localStorage.setItem(`subSettings_${stageId}`, JSON.stringify(updated));
    return updated;
  }

  // Toggle Sub active status
  async toggleSubActive(stageId: string): Promise<Stage> {
    try {
      const currentSettings = this.getSubSettings(stageId);
      const newStatus = !currentSettings.isSubActive;
      
      // If trying to activate a stage, automatically deactivate all other stages
      if (newStatus === true) {
        // Deactivate all other stages first
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('subSettings_')) {
            const stageIdFromKey = key.replace('subSettings_', '');
            if (stageIdFromKey !== stageId) {
              // Deactivate this stage
              this.setSubSettings(stageIdFromKey, { isSubActive: false });
            }
          }
        }
      }
      
      // Update localStorage for current stage
      this.setSubSettings(stageId, { isSubActive: newStatus });
      
      // Try to get current stage data, but provide fallback if authentication fails
      let currentStage;
      try {
        currentStage = await this.getStageById(stageId);
      } catch (error: any) {
        // If authentication fails, create minimal stage object
        log.warn('StageService', 'Could not fetch stage data, using fallback', error instanceof Error ? error : new Error(String(error)));
        currentStage = {
          id: stageId,
          stageNumber: 0,
          name: 'Stufe',
          pointsRequired: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      // Return updated stage with new sub settings
      return {
        ...currentStage,
        isSubActive: newStatus,
        isSubVisible: currentSettings.isSubVisible,
        isSubLocked: currentSettings.isSubLocked
      };
    } catch (error) {
      log.error('StageService', 'Error in toggleSubActive fallback', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  // Toggle Sub visible status
  async toggleSubVisible(stageId: string): Promise<Stage> {
    try {
      const currentSettings = this.getSubSettings(stageId);
      const newStatus = !currentSettings.isSubVisible;
      
      // Update localStorage
      this.setSubSettings(stageId, { isSubVisible: newStatus });
      
      // Try to get current stage data, but provide fallback if authentication fails
      let currentStage;
      try {
        currentStage = await this.getStageById(stageId);
      } catch (error: any) {
        log.warn('StageService', 'Could not fetch stage data, using fallback', error instanceof Error ? error : new Error(String(error)));
        currentStage = {
          id: stageId,
          stageNumber: 0,
          name: 'Stufe',
          pointsRequired: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      // Return updated stage with new sub settings
      return {
        ...currentStage,
        isSubActive: currentSettings.isSubActive,
        isSubVisible: newStatus,
        isSubLocked: currentSettings.isSubLocked
      };
    } catch (error) {
      log.error('StageService', 'Error in toggleSubVisible fallback', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  // Toggle Sub locked status
  async toggleSubLocked(stageId: string): Promise<Stage> {
    try {
      const currentSettings = this.getSubSettings(stageId);
      const newStatus = !currentSettings.isSubLocked;
      
      // Update localStorage
      this.setSubSettings(stageId, { isSubLocked: newStatus });
      
      // Try to get current stage data, but provide fallback if authentication fails
      let currentStage;
      try {
        currentStage = await this.getStageById(stageId);
      } catch (error: any) {
        log.warn('StageService', 'Could not fetch stage data, using fallback', error instanceof Error ? error : new Error(String(error)));
        currentStage = {
          id: stageId,
          stageNumber: 0,
          name: 'Stufe',
          pointsRequired: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      // Return updated stage with new sub settings
      return {
        ...currentStage,
        isSubActive: currentSettings.isSubActive,
        isSubVisible: currentSettings.isSubVisible,
        isSubLocked: newStatus
      };
    } catch (error) {
      log.error('StageService', 'Error in toggleSubLocked fallback', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  // Update Sub settings for a stage
  async updateSubSettings(stageId: string, settings: { isSubActive?: boolean; isSubVisible?: boolean; isSubLocked?: boolean }): Promise<Stage> {
    try {
      // If trying to activate a stage, check if another stage is already active
      if (settings.isSubActive === true) {
        const allStages = await this.getAllStages();
        const activeStages = allStages.filter(stage => 
          stage.id !== stageId && stage.isSubActive === true
        );
        
        if (activeStages.length > 0) {
          const activeStageNames = activeStages.map(s => s.name).join(', ');
          throw new Error(`Bereits aktive Stufe vorhanden: "${activeStageNames}". Bitte deaktiviere diese zuerst, bevor du eine neue Stufe aktivierst.`);
        }
      }
      
      const currentStage = await this.getStageById(stageId);
      const updatedSettings = this.setSubSettings(stageId, settings);
      
      return {
        ...currentStage,
        ...updatedSettings
      };
    } catch (error) {
      log.error('StageService', 'Error in updateSubSettings fallback', error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  // Get stages that are Sub active (for "Aktuelle Stufe" view)
  async getSubActiveStages(): Promise<Stage[]> {
    const allStages = await this.getAllStages();
    return allStages
      .map(stage => ({
        ...stage,
        ...this.getSubSettings(stage.id)
      }))
      .filter(stage => stage.isSubActive === true);
  }

  // Get the currently active stage (should be max 1)
  async getCurrentlyActiveStage(): Promise<Stage | null> {
    const activeStages = await this.getSubActiveStages();
    return activeStages.length > 0 ? activeStages[0] : null;
  }

  // Check if any stage is currently active
  async hasActiveStage(): Promise<boolean> {
    const activeStages = await this.getSubActiveStages();
    return activeStages.length > 0;
  }
}

export const stageService = new StageServiceImpl();