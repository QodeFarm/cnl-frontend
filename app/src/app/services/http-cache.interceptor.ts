import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  response: HttpResponse<any>;
  expiresAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// URL fragments that must never be cached
const SKIP_CACHE_PATTERNS = [
  'users/login',
  'users/token',
  'users/force_change_password',
  'download=excel',
  'document_generator',
  'force_change_password',
];

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {

  private cache = new Map<string, CacheEntry>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      // On any mutation, evict cache entries whose base URL matches
      this.evictRelated(req.url);
      return next.handle(req);
    }

    // Skip blob/file downloads
    if (req.responseType === 'blob') {
      return next.handle(req);
    }

    // Skip explicitly excluded URLs
    if (SKIP_CACHE_PATTERNS.some(p => req.url.includes(p))) {
      return next.handle(req);
    }

    const cacheKey = req.urlWithParams;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() < cached.expiresAt) {
      // Cache hit — return immediately, no network call, no loading spinner
      return of(cached.response.clone());
    }

    // Cache miss — make the real request and store the result
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.status === 200) {
          this.cache.set(cacheKey, {
            response: event.clone(),
            expiresAt: Date.now() + CACHE_TTL_MS,
          });
        }
      })
    );
  }

  /**
   * When a mutation (POST/PUT/PATCH/DELETE) happens, clear any cached GET
   * responses whose base path overlaps with the mutated URL.
   * e.g. DELETE customers/123/ clears all cached customers/* entries.
   */
  private evictRelated(mutatedUrl: string): void {
    // Extract the base resource path (first 2 segments, e.g. "customers/ledger_accounts")
    const segments = mutatedUrl.split('?')[0].split('/').filter(Boolean);
    const basePath = segments.slice(0, 2).join('/');

    if (!basePath) return;

    for (const key of this.cache.keys()) {
      if (key.includes(basePath)) {
        this.cache.delete(key);
      }
    }
  }

  /** Manually clear the entire cache (e.g. on logout) */
  clearAll(): void {
    this.cache.clear();
  }
}
