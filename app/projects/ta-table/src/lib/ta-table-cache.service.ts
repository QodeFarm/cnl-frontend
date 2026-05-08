import { Injectable } from '@angular/core';

interface CacheEntry {
  data: any;
  cachedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

@Injectable({ providedIn: 'root' })
export class TaTableCacheService {
  private cache = new Map<string, CacheEntry>();

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, cachedAt: Date.now() });
  }

  invalidate(apiUrl: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(apiUrl)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
