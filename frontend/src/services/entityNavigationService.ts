/**
 * Entity Navigation Service
 * 
 * Central service to manage navigation integration with the EntityRegistry.
 * Provides stage-aware navigation filtering and role-based visibility.
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import { entityRegistry, Entity, EntityType } from './entityRegistry';
import { useAuthStore } from '../store/useAuthStore';

export interface NavigationEntity {
  id: string;
  label: string;
  path: string;
  entityType: EntityType;
  count: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isActive: boolean;
  stage: number;
}

export interface NavigationSection {
  id: string;
  label: string;
  path: string;
  entities: NavigationEntity[];
  totalCount: number;
  hasActiveItems: boolean;
}

export interface EntityFormConfig {
  entityType: EntityType;
  title: string;
  fields: string[];
  categories: Array<{ value: string; label: string }>;
  priorities: Array<{ value: string; label: string }>;
  stageRestrictions?: {
    minStage: number;
    maxStage?: number;
  };
}

export class EntityNavigationService {
  private static instance: EntityNavigationService;
  
  static getInstance(): EntityNavigationService {
    if (!EntityNavigationService.instance) {
      EntityNavigationService.instance = new EntityNavigationService();
    }
    return EntityNavigationService.instance;
  }

  private constructor() {}

  /**
   * Get navigation sections with entity counts and stage filtering
   */
  async getNavigationSections(userRole: 'DOM' | 'SUB' | 'OBSERVER', currentStage?: number): Promise<NavigationSection[]> {
    try {
      const entities = await entityRegistry.getVisibleEntities(userRole, currentStage);
      
      const sections: NavigationSection[] = [
        {
          id: 'tasks',
          label: 'Aufgaben',
          path: '/education/tasks',
          entities: [],
          totalCount: 0,
          hasActiveItems: false
        },
        {
          id: 'rules',
          label: 'Regeln',
          path: '/education/rules',
          entities: [],
          totalCount: 0,
          hasActiveItems: false
        },
        {
          id: 'goals',
          label: 'Ziele',
          path: '/education/goals',
          entities: [],
          totalCount: 0,
          hasActiveItems: false
        }
      ];

      // Group entities by type and populate sections
      entities.forEach(entity => {
        const sectionId = this.getEntitySectionId(entity.entityType);
        const section = sections.find(s => s.id === sectionId);
        
        if (section) {
          const navEntity: NavigationEntity = {
            id: entity.id,
            label: entity.title,
            path: `${section.path}/${entity.id}`,
            entityType: entity.entityType,
            count: 1,
            priority: this.getEntityPriority(entity),
            isActive: entity.status === 'ACTIVE',
            stage: entity.activeFromStage
          };
          
          section.entities.push(navEntity);
          section.totalCount++;
          
          if (entity.status === 'ACTIVE') {
            section.hasActiveItems = true;
          }
        }
      });

      // Sort entities within each section by priority and creation date
      sections.forEach(section => {
        section.entities.sort((a, b) => {
          const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
          
          return a.label.localeCompare(b.label); // Then alphabetically
        });
      });

      return sections.filter(section => section.totalCount > 0 || userRole === 'DOM');
    } catch (error) {
      console.error('Error loading navigation sections:', error);
      return [];
    }
  }

  /**
   * Get FAB form types filtered by stage and role
   */
  getAvailableFormTypes(userRole: 'DOM' | 'SUB' | 'OBSERVER', currentStage: number): EntityFormConfig[] {
    const baseConfigs: EntityFormConfig[] = [
      {
        entityType: 'TASK',
        title: 'Aufgabe erstellen',
        fields: ['title', 'description', 'category', 'priority', 'dueDate', 'pointsReward'],
        categories: [
          { value: 'routine', label: 'Routine' },
          { value: 'training', label: 'Training' },
          { value: 'maintenance', label: 'Wartung' },
          { value: 'special', label: 'Besonders' }
        ],
        priorities: [
          { value: 'LOW', label: 'Niedrig' },
          { value: 'MEDIUM', label: 'Mittel' },
          { value: 'HIGH', label: 'Hoch' }
        ],
        stageRestrictions: {
          minStage: 1
        }
      },
      {
        entityType: 'RULE',
        title: 'Regel definieren',
        fields: ['title', 'description', 'category', 'severity', 'pointsPenalty'],
        categories: [
          { value: 'behavior', label: 'Verhalten' },
          { value: 'communication', label: 'Kommunikation' },
          { value: 'time', label: 'Zeit' },
          { value: 'personal', label: 'Persönlich' },
          { value: 'safety', label: 'Sicherheit' }
        ],
        priorities: [
          { value: 'LOW', label: 'Info' },
          { value: 'MEDIUM', label: 'Warnung' },
          { value: 'HIGH', label: 'Strikt' }
        ],
        stageRestrictions: {
          minStage: 2 // Rules start from stage 2
        }
      },
      {
        entityType: 'GOAL',
        title: 'Ziel festlegen',
        fields: ['title', 'description', 'category', 'priority', 'targetValue', 'deadline', 'pointsReward'],
        categories: [
          { value: 'personal', label: 'Persönlich' },
          { value: 'relationship', label: 'Beziehung' },
          { value: 'skill', label: 'Fähigkeit' },
          { value: 'fitness', label: 'Fitness' },
          { value: 'academic', label: 'Akademisch' },
          { value: 'career', label: 'Karriere' }
        ],
        priorities: [
          { value: 'LOW', label: 'Niedrig' },
          { value: 'MEDIUM', label: 'Mittel' },
          { value: 'HIGH', label: 'Hoch' }
        ],
        stageRestrictions: {
          minStage: 3 // Goals start from stage 3
        }
      }
    ];

    // Filter by role permissions
    let availableConfigs = baseConfigs;
    
    if (userRole === 'SUB') {
      // SUBs can only create limited entity types
      availableConfigs = baseConfigs.filter(config => 
        config.entityType === 'GOAL' // SUBs can propose goals
      );
    } else if (userRole === 'OBSERVER') {
      // Observers cannot create entities
      availableConfigs = [];
    }

    // Filter by stage restrictions
    return availableConfigs.filter(config => {
      if (!config.stageRestrictions) return true;
      
      const { minStage, maxStage } = config.stageRestrictions;
      return currentStage >= minStage && (!maxStage || currentStage <= maxStage);
    });
  }

  /**
   * Get entity statistics for dashboard widgets
   */
  async getEntityWidgetData(userRole: 'DOM' | 'SUB' | 'OBSERVER', currentStage?: number) {
    try {
      const [entities, statistics] = await Promise.all([
        entityRegistry.getVisibleEntities(userRole, currentStage),
        entityRegistry.getEntityStatistics()
      ]);

      const widgetData = {
        overview: {
          totalEntities: entities.length,
          activeTasks: entities.filter(e => e.entityType === 'TASK' && e.status === 'ACTIVE').length,
          activeRules: entities.filter(e => e.entityType === 'RULE' && e.status === 'ACTIVE').length,
          activeGoals: entities.filter(e => e.entityType === 'GOAL' && e.status === 'ACTIVE').length,
        },
        
        recentActivity: entities
          .filter(e => e.status === 'COMPLETED' || e.updatedAt)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5)
          .map(entity => ({
            id: entity.id,
            title: entity.title,
            type: entity.entityType,
            status: entity.status,
            updatedAt: entity.updatedAt
          })),
        
        priorities: {
          high: entities.filter(e => this.getEntityPriority(e) === 'HIGH' && e.status === 'ACTIVE').length,
          medium: entities.filter(e => this.getEntityPriority(e) === 'MEDIUM' && e.status === 'ACTIVE').length,
          low: entities.filter(e => this.getEntityPriority(e) === 'LOW' && e.status === 'ACTIVE').length,
        },
        
        stageDistribution: entities.reduce((acc, entity) => {
          const stage = entity.activeFromStage;
          acc[stage] = (acc[stage] || 0) + 1;
          return acc;
        }, {} as Record<number, number>),
        
        completion: statistics
      };

      return widgetData;
    } catch (error) {
      console.error('Error loading entity widget data:', error);
      return null;
    }
  }

  /**
   * Check if user can create entities of a specific type
   */
  canCreateEntity(userRole: 'DOM' | 'SUB' | 'OBSERVER', entityType: EntityType, currentStage: number): boolean {
    const availableTypes = this.getAvailableFormTypes(userRole, currentStage);
    return availableTypes.some(config => config.entityType === entityType);
  }

  /**
   * Get suggested entities based on user progress and stage
   */
  async getSuggestedEntities(userRole: 'DOM' | 'SUB' | 'OBSERVER', currentStage: number) {
    try {
      const entities = await entityRegistry.getVisibleEntities(userRole, currentStage);
      const suggestions = [];

      // Suggest high-priority incomplete tasks
      const urgentTasks = entities
        .filter(e => 
          e.entityType === 'TASK' && 
          e.status === 'ACTIVE' && 
          this.getEntityPriority(e) === 'HIGH'
        )
        .slice(0, 3);

      if (urgentTasks.length > 0) {
        suggestions.push({
          type: 'urgent_tasks',
          title: 'Dringende Aufgaben',
          items: urgentTasks.map(task => ({
            id: task.id,
            title: task.title,
            path: `/education/tasks/${task.id}`
          }))
        });
      }

      // Suggest goals near completion
      const nearCompletionGoals = entities
        .filter(e => {
          if (e.entityType !== 'GOAL') return false;
          const goal = e as any; // Type assertion for goal-specific properties
          return goal.targetValue && goal.currentValue && 
                 (goal.currentValue / goal.targetValue) >= 0.8;
        })
        .slice(0, 2);

      if (nearCompletionGoals.length > 0) {
        suggestions.push({
          type: 'near_completion',
          title: 'Bald erreichte Ziele',
          items: nearCompletionGoals.map(goal => ({
            id: goal.id,
            title: goal.title,
            path: `/education/goals/${goal.id}`
          }))
        });
      }

      return suggestions;
    } catch (error) {
      console.error('Error loading suggested entities:', error);
      return [];
    }
  }

  /**
   * Clear navigation cache (useful after entity changes)
   */
  clearNavigationCache(): void {
    entityRegistry.clearCache();
  }

  /**
   * Helper method to get section ID from entity type
   */
  private getEntitySectionId(entityType: EntityType): string {
    switch (entityType) {
      case 'TASK':
        return 'tasks';
      case 'RULE':
        return 'rules';
      case 'GOAL':
        return 'goals';
      default:
        return 'other';
    }
  }

  /**
   * Helper method to extract priority from entity
   */
  private getEntityPriority(entity: Entity): 'LOW' | 'MEDIUM' | 'HIGH' {
    // This assumes all entities have a priority field
    // You might need to adjust based on your actual entity structure
    const priority = (entity as any).priority || 'MEDIUM';
    return priority.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH';
  }
}

// Export singleton instance
export const entityNavigationService = EntityNavigationService.getInstance();