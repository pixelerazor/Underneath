import apiClient from './apiClient';

export interface InsightEntry {
  id: string;
  title: string;
  insight: string;
  context?: string;
  category?: string;
  importance: 'low' | 'medium' | 'high' | 'breakthrough';
  clarity?: number; // 1-10
  application?: string;
  relatedTo?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInsightData {
  title: string;
  insight: string;
  context?: string;
  category?: string;
  importance?: 'low' | 'medium' | 'high' | 'breakthrough';
  clarity?: number;
  application?: string;
  relatedTo?: string;
}

export interface UpdateInsightData extends Partial<CreateInsightData> {}

export interface InsightFilters {
  category?: string;
  importance?: string;
}

class ErkenntnisseService {
  private baseURL = '/erkenntnisse';

  async getAllEntries(filters?: InsightFilters): Promise<InsightEntry[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.importance) params.append('importance', filters.importance);

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<InsightEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreateInsightData): Promise<InsightEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdateInsightData): Promise<InsightEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }
}

export const erkenntnisseService = new ErkenntnisseService();
