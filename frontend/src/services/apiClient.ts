/**
 * Centralized API Client
 * 
 * Shared axios instance with authentication and error handling
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { log } from '../utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create single axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Log API requests in development
    const startTime = Date.now();
    config.metadata = { startTime };
    
    return config;
  },
  (error) => {
    log.error('ApiClient', 'Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log API responses in development
    const config = response.config as any;
    const startTime = config.metadata?.startTime || Date.now();
    const duration = Date.now() - startTime;
    
    log.api(
      config.method?.toUpperCase() || 'GET',
      config.url || '',
      response.status,
      duration
    );
    
    return response;
  },
  async (error) => {
    // Log API errors
    const config = error.config as any;
    const startTime = config?.metadata?.startTime || Date.now();
    const duration = Date.now() - startTime;
    
    log.api(
      config?.method?.toUpperCase() || 'GET',
      config?.url || 'unknown',
      error.response?.status,
      duration
    );
    
    if (error.response?.status === 401) {
      // Try to refresh token before logging out
      const originalRequest = error.config;
      
      if (originalRequest && !(originalRequest as any)._retry) {
        (originalRequest as any)._retry = true;
        
        try {
          const { refreshToken } = useAuthStore.getState();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          // Attempt to refresh the access token
          const response = await apiClient.post('/auth/refresh', { refreshToken });
          const { accessToken } = response.data;
          
          // Update the store with new access token
          const { user } = useAuthStore.getState();
          if (user) {
            useAuthStore.getState().login(user, accessToken, refreshToken);
          }
          
          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          
          log.info('ApiClient', 'Token refreshed successfully');
          return apiClient(originalRequest);
          
        } catch (refreshError) {
          // Refresh failed - now logout
          log.warn('ApiClient', 'Token refresh failed, logging out user');
          const { logout } = useAuthStore.getState();
          logout();
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;