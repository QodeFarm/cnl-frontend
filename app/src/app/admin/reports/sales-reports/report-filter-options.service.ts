import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { FilterOption, ReportFilterControl } from './report-filters.config';

/**
 * Loads dropdown options for report filters from existing master endpoints.
 *
 * - Caches only SUCCESSFUL, NON-EMPTY results, so a transient failure (empty
 *   response / network error) is NOT remembered and is retried next time.
 * - Normalises three response shapes into {value,label}[]:
 *     plain array  [ ... ]            (e.g. customer ?minimal=true)
 *     { data: [...] }                 (most master ModelViewSets)
 *     { results: [...] }              (DRF default pagination)
 * - Fails soft: on error it returns an empty list (uncached) so a broken lookup
 *   never crashes the report screen.
 */
@Injectable({ providedIn: 'root' })
export class ReportFilterOptionsService {
  private cache = new Map<string, FilterOption[]>();

  constructor(private http: HttpClient) {}

  /** Resolve options for a single filter control (backend-loaded or static). */
  getOptions(control: ReportFilterControl): Observable<FilterOption[]> {
    if (control.type === 'staticSelect') {
      return of(control.options ?? []);
    }

    const endpoint = control.endpoint;
    if (!endpoint || !control.valueField || !control.labelField) {
      return of([]);
    }

    const cached = this.cache.get(endpoint);
    if (cached && cached.length) return of(cached);

    const valueField = control.valueField;
    const labelField = control.labelField;

    return this.http.get(endpoint).pipe(
      map((res: any) => {
        const rows: any[] = Array.isArray(res) ? res : (res?.data ?? res?.results ?? []);
        return rows
          .map((row) => ({
            value: String(row?.[valueField] ?? ''),
            label: String(row?.[labelField] ?? '').trim(),
          }))
          .filter((o) => o.value !== '' && o.label !== '');
      }),
      tap((opts) => {
        // Cache only a good result; never remember an empty/failed fetch.
        if (opts.length) this.cache.set(endpoint, opts);
      }),
      catchError(() => of([] as FilterOption[])),
    );
  }
}
