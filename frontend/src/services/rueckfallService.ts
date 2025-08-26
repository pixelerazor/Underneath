import apiClient from './apiClient';

export interface RelapseEntry {
  id: string;
  title: string;
  type?: string;
  severity: 'minor' | 'medium' | 'major' | 'critical';
  triggers: string;
  description?: string;
  duration?: string;
  pointsPenalty?: number;
  emotions?: string;
  wasReported: boolean;
  wasIntentional: boolean;
  requiresAction: boolean;
  hasConsequences: boolean;
  prevention?: string;
  lessons?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelapseData {
  title: string;
  type?: string;
  severity?: 'minor' | 'medium' | 'major' | 'critical';
  triggers: string;
  description?: string;
  duration?: string;
  pointsPenalty?: number;
  emotions?: string;
  wasReported?: boolean;
  wasIntentional?: boolean;
  requiresAction?: boolean;
  hasConsequences?: boolean;
  prevention?: string;
  lessons?: string;
}

export interface UpdateRelapseData extends Partial<CreateRelapseData> {}

export interface RelapseFilters {
  type?: string;
  severity?: string;
}

class RueckfallService {
  private baseURL = '/rueckfaelle';

  async getAllEntries(filters?: RelapseFilters): Promise<RelapseEntry[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.severity) params.append('severity', filters.severity);

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getEntryById(id: string): Promise<RelapseEntry> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createEntry(data: CreateRelapseData): Promise<RelapseEntry> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateEntry(id: string, data: UpdateRelapseData): Promise<RelapseEntry> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }
}

export const rueckfallService = new RueckfallService();
