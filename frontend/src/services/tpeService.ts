import apiClient from './apiClient';

export interface TPEEntry {
  id: string;
  title: string;
  type?: string;
  description?: string;
  duration?: string;
  intensity?: number; // 1-10
  context?: string;
  compliance?: number; // 1-10
  satisfaction?: number; // 1-10
  wasInitiated: boolean;
  wasSuccessful: boolean;
  hadResistance: boolean;
  requiresFollowup: boolean;
  emotions?: string;
  lessons?: string;
  improvements?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTPEData {
  title: string;
  type?: string;
  description?: string;
  duration?: string;
  intensity?: number;
  context?: string;
  compliance?: number;
  satisfaction?: number;
  wasInitiated?: boolean;
  wasSuccessful?: boolean;
  hadResistance?: boolean;
  requiresFollowup?: boolean;
  emotions?: string;
  lessons?: string;
  improvements?: string;
}

export interface UpdateTPEData extends Partial<CreateTPEData> {}

export interface TPEFilters {
  type?: string;
  intensity?: number;
}

class TpeService {
  private baseURL = '/tpe';

  async getAllEntries(filters?: TPEFilters): Promise<TPEEntry[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.intensity) params.append('intensity', filters.intensity.toString());

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<TPEEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreateTPEData): Promise<TPEEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdateTPEData): Promise<TPEEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }
}

export const tpeService = new TpeService();
