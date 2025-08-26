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
  (error) => {
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
      // Token expired or invalid
      const { logout } = useAuthStore.getState();
      log.warn('ApiClient', 'Authentication failed, logging out user');
      logout();
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;