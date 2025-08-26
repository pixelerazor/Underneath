/**
 * Base Service Class
 * 
 * Abstract base class providing common functionality for all services
 * Implements standardized error handling, caching, and API interaction patterns
 * 
 * @author Underneath Team
 * @version 2.0.0
 */

import { AxiosResponse } from 'axios';
import { apiClient } from '../apiClient';
import { log } from '../../utils/logger';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
}

export abstract class BaseService {
  protected abstract readonly endpoint: string;
  private cache = new Map<string, { data: any; expires: number }>();
  
  /**
   * Generic GET request with automatic caching
   */
  protected async get<T>(
    path: string = '', 
    options?: { cache?: CacheOptions }
  ): Promise<T> {
    const url = `${this.endpoint}${path}`;
    const cacheKey = options?.cache?.key || url;
    
    // Check cache first
    if (options?.cache && this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }
    
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.get(url);
      const result = this.handleResponse(response);
      
      // Cache successful responses
      if (options?.cache) {
        const ttl = options.cache.ttl || 300000; // 5 minutes default
        this.cache.set(cacheKey, {
          data: result,
          expires: Date.now() + ttl
        });
      }
      
      return result;
    } catch (error) {
      this.handleError(error, 'GET', url);
      throw error;
    }
  }
  
  /**
   * Generic POST request
   */
  protected async post<T, D = any>(
    path: string = '', 
    data?: D
  ): Promise<T> {
    const url = `${this.endpoint}${path}`;
    
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, data);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'POST', url);
      throw error;
    }
  }
  
  /**
   * Generic PUT request
   */
  protected async put<T, D = any>(
    path: string = '', 
    data?: D
  ): Promise<T> {
    const url = `${this.endpoint}${path}`;
    
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'PUT', url);
      throw error;
    }
  }
  
  /**
   * Generic DELETE request
   */
  protected async delete<T>(path: string = ''): Promise<T> {
    const url = `${this.endpoint}${path}`;
    
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'DELETE', url);
      throw error;
    }
  }
  
  /**
   * Generic PATCH request
   */
  protected async patch<T, D = any>(
    path: string = '', 
    data?: D
  ): Promise<T> {
    const url = `${this.endpoint}${path}`;
    
    try {
      const response: AxiosResponse<ApiResponse<T>> = await apiClient.patch(url, data);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'PATCH', url);
      throw error;
    }
  }
  
  /**
   * Handle standardized API responses
   */
  private handleResponse<T>(response: AxiosResponse<any>): T {
    const { data } = response;
    
    // Handle different API response formats
    if (data && typeof data === 'object') {
      // If it's a structured response with success flag
      if (data.success === false) {
        throw new Error(data.error || 'Unknown API error');
      }
      
      // Return the data property if it exists, otherwise return the whole response
      return (data.data || data) as T;
    }
    
    // Return data directly if it's not an object or is null
    return data as T;
  }
  
  /**
   * Standardized error handling
   */
  private handleError(error: any, method: string, url: string): void {
    const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
    const errorDetails = {
      method,
      url,
      status: error.response?.status,
      message: errorMessage
    };
    
    // Only log errors in development or for server errors (5xx)
    if (process.env.NODE_ENV === 'development' || 
        (error.response?.status >= 500)) {
      log.error(this.constructor.name, `${method} ${url} failed`, error instanceof Error ? error : new Error(errorMessage));
    }
  }
  
  /**
   * Check if cached data is still valid
   */
  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? cached.expires > Date.now() : false;
  }
  
  /**
   * Clear cache for this service
   */
  protected clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}