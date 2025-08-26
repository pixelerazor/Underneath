import apiClient from './apiClient';

export interface ChastityEntry {
  id: string;
  title: string;
  type: string;
  duration?: number;
  device?: string;
  description?: string;
  intensity?: number; // 1-10
  satisfaction?: number; // 1-10
  wasPlanned: boolean;
  wasPermission: boolean;
  wasReward: boolean;
  wasPunishment: boolean;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChastityData {
  title: string;
  type: string;
  duration?: number;
  device?: string;
  description?: string;
  intensity?: number;
  satisfaction?: number;
  wasPlanned?: boolean;
  wasPermission?: boolean;
  wasReward?: boolean;
  wasPunishment?: boolean;
  notes?: string;
}

export interface UpdateChastityData extends Partial<CreateChastityData> {}

export interface ChastityFilters {
  type?: string;
  startDate?: string;
  endDate?: string;
}

class KeuschheitService {
  private baseURL = '/keuschheit';

  async getAllEntries(filters?: ChastityFilters): Promise<ChastityEntry[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<ChastityEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreateChastityData): Promise<ChastityEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdateChastityData): Promise<ChastityEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }
}

export const keuschheitService = new KeuschheitService();