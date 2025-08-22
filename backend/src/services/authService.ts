import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Backend response types (actual structure from backend)
interface BackendAuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface BackendErrorResponse {
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const register = async (email: string, password: string, role: string) => {
  try {
    const response = await api.post<BackendAuthResponse>('/auth/register', {
      email,
      password,
      confirmPassword: password, // Backend erwartet confirmPassword!
      role: role.toUpperCase(), // Stelle sicher dass role uppercase ist (DOM/SUB)
    });
    
    // Response data ist direkt in response.data, NICHT response.data.data
    const { user, accessToken, refreshToken } = response.data;
    
    // Speichere in Store
    useAuthStore.getState().login(user, accessToken, refreshToken);
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as BackendErrorResponse;
      
      // Handle validation errors vom Backend
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const messages = errorData.errors.map(e => e.message).join(', ');
        throw new Error(messages);
      }
      
      // Standard error message
      throw new Error(errorData?.error || 'Registration failed');
    }
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<BackendAuthResponse>('/auth/login', {
      email,
      password,
    });
    
    // Response data ist direkt in response.data, NICHT response.data.data
    const { user, accessToken, refreshToken } = response.data;
    
    // Speichere in Store
    useAuthStore.getState().login(user, accessToken, refreshToken);
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as BackendErrorResponse;
      throw new Error(errorData?.error || 'Login failed');
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const { refreshToken } = useAuthStore.getState();
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } catch (error) {
    // Logout auch bei Fehler lokal durchführen
    console.error('Logout error:', error);
  } finally {
    // Immer local logout durchführen
    useAuthStore.getState().logout();
  }
};

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const { refreshToken } = useAuthStore.getState();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    
    // Backend gibt nur { accessToken: "..." } zurück
    const { accessToken } = response.data;
    
    // Update access token im Store
    const currentUser = useAuthStore.getState().user;
    const currentRefreshToken = useAuthStore.getState().refreshToken;
    
    if (currentUser && currentRefreshToken) {
      useAuthStore.getState().login(currentUser, accessToken, currentRefreshToken);
    }
    
    return accessToken;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as BackendErrorResponse;
      throw new Error(errorData?.error || 'Token refresh failed');
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get<{ user: any }>('/auth/me');
    // Backend gibt { user: {...} } zurück
    return response.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as BackendErrorResponse;
      throw new Error(errorData?.error || 'Failed to fetch user data');
    }
    throw error;
  }
};

export default api;