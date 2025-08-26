/**
 * Entity Service Class
 * 
 * Abstract service for CRUD operations on entities
 * Provides standardized methods for Create, Read, Update, Delete operations
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import { BaseService } from './BaseService';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class EntityService<T extends BaseEntity, CreateData = Partial<T>, UpdateData = Partial<T>> extends BaseService {
  
  /**
   * Get all entities with optional filtering and pagination
   */
  async getAll(filters?: EntityFilter): Promise<PaginatedResponse<T>> {
    const queryParams = filters ? new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    const path = queryParams ? `?${queryParams}` : '';
    const response = await this.get<PaginatedResponse<T> | T[]>(path, {
      cache: { ttl: 60000, key: `${this.endpoint}_all_${queryParams}` }
    });
    
    // Handle both paginated and direct array responses
    if (Array.isArray(response)) {
      return {
        items: response,
        total: response.length,
        page: 1,
        limit: response.length,
        totalPages: 1
      };
    }
    
    return response as PaginatedResponse<T>;
  }
  
  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<T> {
    return this.get<T>(`/${id}`, {
      cache: { ttl: 300000, key: `${this.endpoint}_${id}` }
    });
  }
  
  /**
   * Create new entity
   */
  async create(data: CreateData): Promise<T> {
    const result = await this.post<T, CreateData>('', data);
    
    // Clear relevant caches
    this.clearCache();
    
    return result;
  }
  
  /**
   * Update existing entity
   */
  async update(id: string, data: UpdateData): Promise<T> {
    const result = await this.put<T, UpdateData>(`/${id}`, data);
    
    // Clear specific entity cache and list caches
    this.clearCache(`${this.endpoint}_${id}`);
    this.clearCache();
    
    return result;
  }
  
  /**
   * Delete entity
   */
  async remove(id: string): Promise<{ success: boolean; message?: string }> {
    const result = await this.delete<{ success: boolean; message?: string }>(`/${id}`);
    
    // Clear specific entity cache and list caches
    this.clearCache(`${this.endpoint}_${id}`);
    this.clearCache();
    
    return result;
  }
  
  /**
   * Batch operations
   */
  async batchCreate(items: CreateData[]): Promise<T[]> {
    const result = await this.post<T[], CreateData[]>('/batch', items);
    this.clearCache();
    return result;
  }
  
  async batchUpdate(updates: Array<{ id: string; data: UpdateData }>): Promise<T[]> {
    const result = await this.put<T[], Array<{ id: string; data: UpdateData }>>('/batch', updates);
    this.clearCache();
    return result;
  }
  
  async batchDelete(ids: string[]): Promise<{ success: boolean; deletedCount: number }> {
    const result = await this.post<{ success: boolean; deletedCount: number }>('/batch/delete', { ids });
    this.clearCache();
    return result;
  }
  
  /**
   * Search entities
   */
  async search(query: string, filters?: Partial<EntityFilter>): Promise<T[]> {
    const searchFilters = { search: query, limit: 50, ...filters };
    const response = await this.getAll(searchFilters);
    return response.items;
  }
}