import { EntityService } from './core/EntityService';
import { EntityFilter } from './core/EntityService';

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

export interface FAQFilters extends EntityFilter {
  category?: string;
  priority?: string;
  isPublic?: boolean;
}

class FAQServiceImpl extends EntityService<FAQ, CreateFAQData, UpdateFAQData> {
  protected readonly endpoint = '/faq';

  async getAllFAQs(filters?: FAQFilters): Promise<FAQ[]> {
    const response = await this.getAll(filters);
    return response.items;
  }

  async getFAQById(id: string): Promise<FAQ> {
    return this.getById(id);
  }

  async createFAQ(data: CreateFAQData): Promise<FAQ> {
    return this.create(data);
  }

  async updateFAQ(id: string, data: UpdateFAQData): Promise<FAQ> {
    return this.update(id, data);
  }

  async deleteFAQ(id: string): Promise<void> {
    await this.remove(id);
  }

  async searchFAQs(query: string): Promise<FAQ[]> {
    return this.search(query);
  }
}

export const faqService = new FAQServiceImpl();