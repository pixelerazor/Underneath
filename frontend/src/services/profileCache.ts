/**
 * Profile Cache Service
 * 
 * Caches profile data to prevent multiple simultaneous API calls
 * 
 * @author Underneath Team
 * @version 1.0.0
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  loading: boolean;
}

class ProfileCacheService {
  private cache = new Map<string, CacheEntry>();
  private loadingPromises = new Map<string, Promise<any>>();
  private readonly CACHE_TTL = 30000; // 30 seconds

  /**
   * Get cached profile data or fetch if needed
   */
  async getProfile(userId: string, fetchFn: () => Promise<any>): Promise<any> {
    const cacheKey = `profile-${userId}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && !this.isExpired(cached) && !cached.loading) {
      return cached.data;
    }

    // If already loading, return the same promise
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Start new fetch
    const loadingPromise = this.fetchAndCache(cacheKey, fetchFn);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const result = await loadingPromise;
      this.loadingPromises.delete(cacheKey);
      return result;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  private async fetchAndCache(cacheKey: string, fetchFn: () => Promise<any>): Promise<any> {
    // Mark as loading
    this.cache.set(cacheKey, {
      data: null,
      timestamp: Date.now(),
      loading: true
    });

    try {
      const data = await fetchFn();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        loading: false
      });

      return data;
    } catch (error) {
      // Remove loading state on error
      this.cache.delete(cacheKey);
      throw error;
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.CACHE_TTL;
  }

  /**
   * Clear cache for a specific user
   */
  clearUserCache(userId: string): void {
    const cacheKey = `profile-${userId}`;
    this.cache.delete(cacheKey);
    this.loadingPromises.delete(cacheKey);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

export const profileCache = new ProfileCacheService();