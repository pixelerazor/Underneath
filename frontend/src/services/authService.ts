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

// WICHTIG: Backend sendet direkt { user, accessToken, refreshToken }
// NICHT { success: true, data: { ... } }
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
      confirmPassword: password, // WICHTIG: Backend erwartet confirmPassword!
      role: role.toUpperCase(), // Sicherstellen dass role uppercase ist
    });
    
    // Response ist direkt in response.data, NICHT response.data.data!
    const { user, accessToken, refreshToken } = response.data;
    useAuthStore.getState().login({ ...user, status: 'ACTIVE' as const, role: user.role as any }, accessToken, refreshToken);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as BackendErrorResponse;
      
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const messages = errorData.errors.map(e => e.message).join(', ');
        throw new Error(messages);
      }
      
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
    
    // Response ist direkt in response.data, NICHT response.data.data!
    const { user, accessToken, refreshToken } = response.data;
    useAuthStore.getState().login({ ...user, status: 'ACTIVE' as const, role: user.role as any }, accessToken, refreshToken);
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
    console.error('Logout error:', error);
  } finally {
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
    
    // Backend sendet nur { accessToken: "..." }
    const { accessToken } = response.data;
    
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
