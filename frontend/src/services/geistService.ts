import { EntityService } from './core/EntityService';
import { EntityFilter } from './core/EntityService';

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

export interface WellbeingFilters extends EntityFilter {
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

class GeistServiceImpl extends EntityService<WellbeingEntry, CreateWellbeingData, UpdateWellbeingData> {
  protected readonly endpoint = '/geist';

  async getAllEntries(filters?: WellbeingFilters): Promise<WellbeingEntry[]> {
    const response = await this.getAll(filters);
    return response.items;
  }

  async getEntryById(id: string): Promise<WellbeingEntry> {
    return this.getById(id);
  }

  async createEntry(data: CreateWellbeingData): Promise<WellbeingEntry> {
    return this.create(data);
  }

  async updateEntry(id: string, data: UpdateWellbeingData): Promise<WellbeingEntry> {
    return this.update(id, data);
  }

  async deleteEntry(id: string): Promise<void> {
    await this.remove(id);
  }

  async getStatistics(period: 'week' | 'month' | 'year' = 'month'): Promise<WellbeingStatistics> {
    return this.get<WellbeingStatistics>(`/statistics?period=${period}`);
  }
}

export const geistService = new GeistServiceImpl();