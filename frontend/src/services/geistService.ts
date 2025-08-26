import apiClient from './apiClient';

export interface WellbeingEntry {
  id: string;
  title: string;
  description?: string;
  mood: number; // 1-10
  energy: number; // 1-10
  category?: string;
  triggers?: string;
  duration?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWellbeingData {
  title: string;
  description?: string;
  mood: number;
  energy: number;
  category?: string;
  triggers?: string;
  duration?: string;
  notes?: string;
}

export interface UpdateWellbeingData extends Partial<CreateWellbeingData> {}

export interface WellbeingFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface WellbeingStatistics {
  averageMood: number | null;
  averageEnergy: number | null;
  totalEntries: number;
  categories: Record<string, number>;
}

class GeistService {
  private baseURL = '/geist';

  async getAllEntries(filters?: WellbeingFilters): Promise<WellbeingEntry[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<WellbeingEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreateWellbeingData): Promise<WellbeingEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdateWellbeingData): Promise<WellbeingEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }

  async getStatistics(period: 'week' | 'month' | 'year' = 'month'): Promise<WellbeingStatistics> {
    const response = await apiClient.get(`${this.baseURL}/statistics?period=${period}`);
    return response.data;
  }
}

export const geistService = new GeistService();