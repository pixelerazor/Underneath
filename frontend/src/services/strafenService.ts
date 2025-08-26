import apiClient from './apiClient';

export interface PunishmentEntry {
  id: string;
  title: string;
  reason: string;
  description?: string;
  severity: 'light' | 'medium' | 'severe' | 'extreme';
  category?: string;
  duration?: string;
  intensity?: number; // 1-10
  tools?: string;
  isCompleted: boolean;
  wasEffective: boolean;
  wasConsensual: boolean;
  requiresFollowup: boolean;
  reaction?: string;
  effectiveness?: string;
  userId: string;
  adminBy?: string;
  user: {
    id: string;
    displayName: string;
    role: string;
  };
  administrator?: {
    id: string;
    displayName: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePunishmentData {
  title: string;
  reason: string;
  userId: string;
  description?: string;
  severity: 'light' | 'medium' | 'severe' | 'extreme';
  category?: string;
  duration?: string;
  intensity?: number;
  tools?: string;
  isCompleted?: boolean;
  wasEffective?: boolean;
  wasConsensual?: boolean;
  requiresFollowup?: boolean;
  reaction?: string;
  effectiveness?: string;
}

export interface UpdatePunishmentData extends Partial<CreatePunishmentData> {}

export interface PunishmentFilters {
  severity?: string;
  category?: string;
  userId?: string;
}

class StrafenService {
  private baseURL = '/strafen';

  async getAllEntries(filters?: PunishmentFilters): Promise<PunishmentEntry[]> {
    const params = new URLSearchParams();
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.userId) params.append('userId', filters.userId);

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<PunishmentEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreatePunishmentData): Promise<PunishmentEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdatePunishmentData): Promise<PunishmentEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }
}

export const strafenService = new StrafenService();
