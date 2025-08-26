/**
 * Task Service
 * 
 * Handles all task-related operations using the unified entity service architecture
 * Provides task-specific methods and business logic
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import { EntityService } from '../core/EntityService';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'ROUTINE' | 'TRAINING' | 'MAINTENANCE' | 'SPECIAL' | 'PUNISHMENT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  pointsReward: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PAUSED';
  dueDate?: string;
  completedAt?: string;
  activeFromStage: number;
  activeToStage?: number;
  creatorId: string;
  assignedToId?: string;
  creator: {
    displayName?: string;
    role: string;
  };
  assignedTo?: {
    displayName?: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  category: Task['category'];
  priority?: Task['priority'];
  pointsReward?: number;
  dueDate?: string;
  activeFromStage?: number;
  activeToStage?: number;
  assignedToId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: Task['category'];
  priority?: Task['priority'];
  pointsReward?: number;
  dueDate?: string;
  status?: Task['status'];
  activeFromStage?: number;
  activeToStage?: number;
  assignedToId?: string;
}

export interface TaskFilter {
  status?: Task['status'] | Task['status'][];
  category?: Task['category'] | Task['category'][];
  priority?: Task['priority'] | Task['priority'][];
  assignedToId?: string;
  creatorId?: string;
  activeInStage?: number;
  dueAfter?: string;
  dueBefore?: string;
  completedAfter?: string;
  completedBefore?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'title' | 'dueDate' | 'priority' | 'createdAt' | 'completedAt';
  sortOrder?: 'asc' | 'desc';
}

class TaskServiceImpl extends EntityService<Task, CreateTaskData, UpdateTaskData> {
  protected readonly endpoint = '/tasks';
  
  /**
   * Get tasks filtered by specific criteria
   */
  async getFiltered(filters: TaskFilter): Promise<Task[]> {
    const response = await this.getAll(filters);
    return response.items;
  }
  
  /**
   * Get active tasks for a specific stage
   */
  async getActiveForStage(stageNumber: number): Promise<Task[]> {
    return this.getFiltered({
      status: 'ACTIVE',
      activeInStage: stageNumber,
      sortBy: 'priority',
      sortOrder: 'desc'
    });
  }
  
  /**
   * Get completed tasks for a specific date range
   */
  async getCompletedInRange(startDate: string, endDate: string): Promise<Task[]> {
    return this.getFiltered({
      status: 'COMPLETED',
      completedAfter: startDate,
      completedBefore: endDate,
      sortBy: 'completedAt',
      sortOrder: 'desc'
    });
  }
  
  /**
   * Get tasks completed today
   */
  async getCompletedToday(): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return this.getCompletedInRange(`${today}T00:00:00Z`, `${tomorrow}T00:00:00Z`);
  }
  
  /**
   * Get overdue tasks
   */
  async getOverdue(): Promise<Task[]> {
    const now = new Date().toISOString();
    
    return this.getFiltered({
      status: 'ACTIVE',
      dueBefore: now,
      sortBy: 'dueDate',
      sortOrder: 'asc'
    });
  }
  
  /**
   * Complete a task
   */
  async complete(id: string): Promise<Task> {
    return this.update(id, {
      status: 'COMPLETED'
    });
  }
  
  /**
   * Cancel a task
   */
  async cancel(id: string, reason?: string): Promise<Task> {
    return this.update(id, {
      status: 'CANCELLED',
      description: reason ? `${reason}\n\nCancelled on ${new Date().toISOString()}` : undefined
    });
  }
  
  /**
   * Pause a task
   */
  async pause(id: string): Promise<Task> {
    return this.update(id, {
      status: 'PAUSED'
    });
  }
  
  /**
   * Resume a paused task
   */
  async resume(id: string): Promise<Task> {
    return this.update(id, {
      status: 'ACTIVE'
    });
  }
  
  /**
   * Assign task to user
   */
  async assign(id: string, assigneeId: string): Promise<Task> {
    return this.update(id, {
      assignedToId: assigneeId
    });
  }
  
  /**
   * Update task priority
   */
  async updatePriority(id: string, priority: Task['priority']): Promise<Task> {
    return this.update(id, { priority });
  }
  
  /**
   * Extend task due date
   */
  async extendDueDate(id: string, newDueDate: string): Promise<Task> {
    return this.update(id, {
      dueDate: newDueDate
    });
  }
  
  /**
   * Get task statistics
   */
  async getStatistics(stageNumber?: number): Promise<{
    total: number;
    active: number;
    completed: number;
    overdue: number;
    completedToday: number;
  }> {
    const baseFilters = stageNumber ? { activeInStage: stageNumber } : {};
    
    const [
      allTasks,
      activeTasks,
      completedTasks,
      overdueTasks,
      todayTasks
    ] = await Promise.all([
      this.getFiltered(baseFilters),
      this.getFiltered({ ...baseFilters, status: 'ACTIVE' }),
      this.getFiltered({ ...baseFilters, status: 'COMPLETED' }),
      this.getOverdue(),
      this.getCompletedToday()
    ]);
    
    return {
      total: allTasks.length,
      active: activeTasks.length,
      completed: completedTasks.length,
      overdue: overdueTasks.length,
      completedToday: todayTasks.length
    };
  }
}

// Export singleton instance
export const taskService = new TaskServiceImpl();
export default taskService;