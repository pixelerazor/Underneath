import apiClient from './apiClient';

export interface InformationEntry {
  id: string;
  title: string;
  content: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  isPublic: boolean;
  tags: string[];
  creatorId: string;
  creator: {
    id: string;
    displayName: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateInformationData {
  title: string;
  content: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateInformationData extends Partial<CreateInformationData> {}

export interface InformationFilters {
  category?: string;
  priority?: string;
  isPublic?: boolean;
}

class AllgemeineInformationenService {
  private baseURL = '/allgemeine-informationen';

  async getAllEntries(filters?: InformationFilters): Promise<InformationEntry[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<InformationEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreateInformationData): Promise<InformationEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdateInformationData): Promise<InformationEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }
}

export const allgemeineInformationenService = new AllgemeineInformationenService();
