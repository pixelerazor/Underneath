import apiClient from './apiClient';

export interface TriggerEntry {
  id: string;
  title: string;
  type?: string;
  description?: string;
  intensity?: number; // 1-10
  frequency?: string;
  response?: string;
  context?: string;
  emotions?: string;
  physicalReaction?: string;
  wasExpected: boolean;
  wasManaged: boolean;
  causedRelapse: boolean;
  isRecurring: boolean;
  copingStrategies?: string;
  prevention?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTriggerData {
  title: string;
  type?: string;
  description?: string;
  intensity?: number;
  frequency?: string;
  response?: string;
  context?: string;
  emotions?: string;
  physicalReaction?: string;
  wasExpected?: boolean;
  wasManaged?: boolean;
  causedRelapse?: boolean;
  isRecurring?: boolean;
  copingStrategies?: string;
  prevention?: string;
}

export interface UpdateTriggerData extends Partial<CreateTriggerData> {}

export interface TriggerFilters {
  type?: string;
  frequency?: string;
  isRecurring?: boolean;
}

class TriggerService {
  private baseURL = '/trigger';

  async getAllEntries(filters?: TriggerFilters): Promise<TriggerEntry[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.frequency) params.append('frequency', filters.frequency);
    if (filters?.isRecurring !== undefined) params.append('isRecurring', filters.isRecurring.toString());

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<TriggerEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreateTriggerData): Promise<TriggerEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdateTriggerData): Promise<TriggerEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }
}

export const triggerService = new TriggerService();
