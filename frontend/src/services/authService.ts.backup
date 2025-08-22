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

interface AuthResponse {
  success: boolean;
  data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

export const register = async (email: string, password: string, role: string) => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      role,
    });
    
    const { user, accessToken, refreshToken } = response.data.data;
    useAuthStore.getState().login(user, accessToken, refreshToken);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    
    const { user, accessToken, refreshToken } = response.data.data;
    useAuthStore.getState().login(user, accessToken, refreshToken);
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const { refreshToken } = useAuthStore.getState();
    await api.post('/auth/logout', { refreshToken });
    useAuthStore.getState().logout();
  } catch (error) {
    useAuthStore.getState().logout();
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const { refreshToken } = useAuthStore.getState();
    const response = await api.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>('/auth/refresh', {
      refreshToken,
    });
    
    const { accessToken } = response.data.data;
    useAuthStore.getState().login(
      useAuthStore.getState().user!,
      accessToken,
      refreshToken!
    );
    
    return accessToken;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Token refresh failed');
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user data');
    }
    throw error;
  }
};

export default api;
