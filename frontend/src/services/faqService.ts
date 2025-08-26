import apiClient from './apiClient';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  isPublic: boolean;
  creatorId: string;
  creator: {
    id: string;
    displayName: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateFAQData extends Partial<CreateFAQData> {}

export interface FAQFilters {
  category?: string;
  priority?: string;
  isPublic?: boolean;
}

class FAQService {
  private baseURL = '/faq';

  async getAllFAQs(filters?: FAQFilters): Promise<FAQ[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());

    const response = await apiClient.get(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getFAQById(id: string): Promise<FAQ> {
    const response = await apiClient.get(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createFAQ(data: CreateFAQData): Promise<FAQ> {
    const response = await apiClient.post(this.baseURL, data);
    return response.data;
  }

  async updateFAQ(id: string, data: UpdateFAQData): Promise<FAQ> {
    const response = await apiClient.put(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deleteFAQ(id: string): Promise<void> {
    await apiClient.delete(`${this.baseURL}/${id}`);
  }

  async searchFAQs(query: string): Promise<FAQ[]> {
    const response = await apiClient.get(`${this.baseURL}/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const faqService = new FAQService();