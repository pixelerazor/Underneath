/**
 * Entity Registry Service
 * 
 * Central management system for all stage-based entities in the application.
 * Provides unified access to Tasks, Rules, Goals, and other entities with
 * stage-based visibility and role-based permissions.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { apiClient } from './apiClient';

export interface BaseEntity {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
  activeFromStage: number;
  activeToStage?: number | null;
  entityType: EntityType;
}

export interface Task extends BaseEntity {
  entityType: 'TASK';
  category: 'ROUTINE' | 'TRAINING' | 'MAINTENANCE' | 'SPECIAL' | 'PUNISHMENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  pointsReward: number;
  dueDate?: string;
  completedAt?: string;
  creatorId: string;
  assignedToId?: string;
  creator: { displayName?: string; role: string };
  assignedTo?: { displayName?: string; role: string };
}

export interface Rule extends BaseEntity {
  entityType: 'RULE';
  category: 'BEHAVIOR' | 'COMMUNICATION' | 'TIME' | 'PERSONAL' | 'SAFETY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  pointsPenalty: number;
  isActive: boolean;
  creatorId: string;
  applicableToId?: string;
  creator: { displayName?: string; role: string };
  applicableTo?: { displayName?: string; role: string };
  violations: RuleViolation[];
}

export interface Goal extends BaseEntity {
  entityType: 'GOAL';
  category: 'PERSONAL' | 'RELATIONSHIP' | 'SKILL' | 'FITNESS' | 'ACADEMIC' | 'CAREER';
  targetValue?: number;
  currentValue: number;
  pointsReward: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: string;
  completedAt?: string;
  creatorId: string;
  assignedToId?: string;
  creator: { displayName?: string; role: string };
  assignedTo?: { displayName?: string; role: string };
}

export interface RuleViolation {
  id: string;
  ruleId: string;
  userId: string;
  description?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  pointsPenalty: number;
  status: 'PENDING' | 'CONFIRMED' | 'DISPUTED' | 'DISMISSED';
  occurredAt: string;
  resolvedAt?: string;
}

export type EntityType = 'TASK' | 'RULE' | 'GOAL';
export type Entity = Task | Rule | Goal;

export interface EntityFilter {
  entityType?: EntityType;
  currentStage?: number;
  activeOnly?: boolean;
  status?: string[];
  createdBy?: string;
  assignedTo?: string;
}

export interface EntityCreateData {
  title: string;
  description?: string;
  category: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  activeFromStage?: number;
  activeToStage?: number;
  pointsReward?: number;
  pointsPenalty?: number;
  dueDate?: string;
  deadline?: string;
  targetValue?: number;
  assignedToId?: string;
  applicableToId?: string;
}

export interface EntityUpdateData extends Partial<EntityCreateData> {
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
  currentValue?: number;
}

export interface StageInfo {
  stageNumber: number;
  name: string;
  description?: string;
  pointsRequired: number;
  color?: string;
  isActive: boolean;
}

export interface UserStageInfo {
  pointAccount: {
    totalPoints: number;
    currentStage: number;
    pointsInStage: number;
    nextStageThreshold: number;
  };
  currentStage: StageInfo;
  progress: {
    pointsInCurrentStage: number;
    pointsToNextStage: number;
    progressPercentage: number;
    isMaxStage: boolean;
  };
}

export class EntityRegistry {
  private static instance: EntityRegistry;
  private cache: Map<string, any> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  static getInstance(): EntityRegistry {
    if (!EntityRegistry.instance) {
      EntityRegistry.instance = new EntityRegistry();
    }
    return EntityRegistry.instance;
  }

  private constructor() {}

  /**
   * Get all entities for the current user with stage filtering
   */
  async getEntities(filter: EntityFilter = {}): Promise<Entity[]> {
    const cacheKey = `entities_${JSON.stringify(filter)}`;
    
    if (this.getCachedData(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const params = new URLSearchParams();
      if (filter.entityType) params.append('entityType', filter.entityType);
      if (filter.currentStage) params.append('currentStage', filter.currentStage.toString());
      if (filter.activeOnly !== undefined) params.append('activeOnly', filter.activeOnly.toString());

      const response = await apiClient.get(`stages/entities?${params}`);
      
      if (response.data.success) {
        const entities = response.data.data;
        this.setCachedData(cacheKey, entities);
        return entities;
      }
      
      throw new Error(response.data.error || 'Failed to fetch entities');
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  }

  /**
   * Create a new entity
   */
  async createEntity(entityType: EntityType, data: EntityCreateData): Promise<Entity> {
    try {
      const endpoint = this.getEntityEndpoint(entityType);
      const response = await apiClient.post(endpoint, data);
      
      if (response.data.success) {
        this.clearEntityCache();
        return response.data.data;
      }
      
      throw new Error(response.data.error || `Failed to create ${entityType.toLowerCase()}`);
    } catch (error) {
      console.error(`Error creating ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Update an entity
   */
  async updateEntity(entityType: EntityType, entityId: string, data: EntityUpdateData): Promise<Entity> {
    try {
      const endpoint = this.getEntityEndpoint(entityType);
      const response = await apiClient.put(`${endpoint}/${entityId}`, data);
      
      if (response.data.success) {
        this.clearEntityCache();
        return response.data.data;
      }
      
      throw new Error(response.data.error || `Failed to update ${entityType.toLowerCase()}`);
    } catch (error) {
      console.error(`Error updating ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Delete an entity
   */
  async deleteEntity(entityType: EntityType, entityId: string): Promise<boolean> {
    try {
      const endpoint = this.getEntityEndpoint(entityType);
      const response = await apiClient.delete(`${endpoint}/${entityId}`);
      
      if (response.data.success) {
        this.clearEntityCache();
        return true;
      }
      
      throw new Error(response.data.error || `Failed to delete ${entityType.toLowerCase()}`);
    } catch (error) {
      console.error(`Error deleting ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: string): Promise<Task> {
    return this.updateEntity('TASK', taskId, { status: 'COMPLETED' });
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(goalId: string, currentValue: number): Promise<Goal> {
    return this.updateEntity('GOAL', goalId, { currentValue });
  }

  /**
   * Report a rule violation
   */
  async reportRuleViolation(ruleId: string, description?: string): Promise<RuleViolation> {
    try {
      const response = await apiClient.post('rules/violations', {
        ruleId,
        description
      });
      
      if (response.data.success) {
        this.clearEntityCache();
        return response.data.data;
      }
      
      throw new Error(response.data.error || 'Failed to report rule violation');
    } catch (error) {
      console.error('Error reporting rule violation:', error);
      throw error;
    }
  }

  /**
   * Get current user's stage information
   */
  async getUserStageInfo(): Promise<UserStageInfo> {
    const cacheKey = 'user_stage_info';
    
    if (this.getCachedData(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      console.log('Making API request to:', 'points/current-stage');
      const response = await apiClient.get('points/current-stage');
      
      if (response.data.success) {
        const stageInfo = response.data.data;
        this.setCachedData(cacheKey, stageInfo);
        return stageInfo;
      }
      
      throw new Error(response.data.error || 'Failed to fetch stage info');
    } catch (error) {
      console.error('Error fetching user stage info:', error);
      throw error;
    }
  }

  /**
   * Get all available stages
   */
  async getAllStages(): Promise<StageInfo[]> {
    const cacheKey = 'all_stages';
    
    if (this.getCachedData(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const response = await apiClient.get('stages');
      
      if (response.data.success) {
        const stages = response.data.data;
        this.setCachedData(cacheKey, stages, 15 * 60 * 1000); // Cache stages for 15 minutes
        return stages;
      }
      
      throw new Error(response.data.error || 'Failed to fetch stages');
    } catch (error) {
      console.error('Error fetching stages:', error);
      throw error;
    }
  }

  /**
   * Get entities visible in current stage (for role-based visibility)
   */
  async getVisibleEntities(userRole: 'DOM' | 'SUB' | 'OBSERVER', currentStage?: number): Promise<Entity[]> {
    try {
      const filter: EntityFilter = {
        activeOnly: true,
        currentStage: currentStage
      };

      const entities = await this.getEntities(filter);
      
      // Apply role-based filtering
      return entities.filter(entity => {
        if (userRole === 'DOM') {
          return true; // DOMs can see all entities
        } else if (userRole === 'SUB') {
          // SUBs can only see entities assigned to them or with no specific assignee
          return !entity.assignedToId || entity.assignedToId === 'current_user'; // TODO: Replace with actual user ID
        } else {
          return true; // Observers can see all for monitoring
        }
      });
    } catch (error) {
      console.error('Error fetching visible entities:', error);
      throw error;
    }
  }

  /**
   * Get entity statistics for dashboard
   */
  async getEntityStatistics(): Promise<{
    totalActive: number;
    completedToday: number;
    pendingTasks: number;
    activeRules: number;
    goalsProgress: number;
  }> {
    const cacheKey = 'entity_statistics';
    
    if (this.getCachedData(cacheKey)) {
      return this.getCachedData(cacheKey);
    }

    try {
      const entities = await this.getEntities({ activeOnly: true });
      
      const statistics = {
        totalActive: entities.length,
        completedToday: entities.filter(e => 
          e.status === 'COMPLETED' && 
          new Date(e.updatedAt).toDateString() === new Date().toDateString()
        ).length,
        pendingTasks: entities.filter(e => e.entityType === 'TASK' && e.status === 'ACTIVE').length,
        activeRules: entities.filter(e => e.entityType === 'RULE' && e.status === 'ACTIVE').length,
        goalsProgress: Math.round(
          entities
            .filter(e => e.entityType === 'GOAL')
            .reduce((acc, goal) => {
              const g = goal as Goal;
              if (g.targetValue && g.targetValue > 0) {
                return acc + (g.currentValue / g.targetValue * 100);
              }
              return acc;
            }, 0) / Math.max(1, entities.filter(e => e.entityType === 'GOAL').length)
        )
      };
      
      this.setCachedData(cacheKey, statistics, 2 * 60 * 1000); // Cache for 2 minutes
      return statistics;
    } catch (error) {
      console.error('Error fetching entity statistics:', error);
      throw error;
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear entity-related cache
   */
  private clearEntityCache(): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes('entities') || key.includes('statistics')
    );
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get the appropriate API endpoint for entity type
   */
  private getEntityEndpoint(entityType: EntityType): string {
    switch (entityType) {
      case 'TASK':
        return 'tasks';
      case 'RULE':
        return 'rules';
      case 'GOAL':
        return 'goals';
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }

  /**
   * Get cached data if still valid
   */
  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * Set cached data with timestamp
   */
  private setCachedData(key: string, data: any, customTimeout?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout: customTimeout || this.cacheTimeout
    });
  }

  /**
   * Get form configuration for entity type
   */
  static getEntityFormConfig(entityType: EntityType): any {
    switch (entityType) {
      case 'TASK':
        return {
          fields: ['title', 'description', 'category', 'priority', 'dueDate', 'pointsReward', 'assignedTo'],
          categories: [
            { value: 'routine', label: 'Routine' },
            { value: 'training', label: 'Training' },
            { value: 'maintenance', label: 'Wartung' },
            { value: 'special', label: 'Besonders' },
            { value: 'punishment', label: 'Strafe' }
          ]
        };
      case 'RULE':
        return {
          fields: ['title', 'description', 'category', 'severity', 'pointsPenalty', 'applicableTo'],
          categories: [
            { value: 'behavior', label: 'Verhalten' },
            { value: 'communication', label: 'Kommunikation' },
            { value: 'time', label: 'Zeit' },
            { value: 'personal', label: 'Persönlich' },
            { value: 'safety', label: 'Sicherheit' }
          ]
        };
      case 'GOAL':
        return {
          fields: ['title', 'description', 'category', 'priority', 'targetValue', 'deadline', 'pointsReward', 'assignedTo'],
          categories: [
            { value: 'personal', label: 'Persönlich' },
            { value: 'relationship', label: 'Beziehung' },
            { value: 'skill', label: 'Fähigkeit' },
            { value: 'fitness', label: 'Fitness' },
            { value: 'academic', label: 'Akademisch' },
            { value: 'career', label: 'Karriere' }
          ]
        };
      default:
        return { fields: [], categories: [] };
    }
  }
}

// Export singleton instance
export const entityRegistry = EntityRegistry.getInstance();