import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// ─── Shared Types ────────────────────────────────────────────
export interface BulkField {
  key: string;        // key in bulkEditForm
  apiKey: string;     // key sent to API
  label: string;      // UI label
  type: 'dropdown' | 'static-dropdown' | 'number' | 'boolean' | 'text';
  url?: string;       // lazy API url for dropdowns
  dataKey?: string;   // value field in dropdown option
  dataLabel?: string; // label field in dropdown option
  options?: Array<{ label: string; value: any }>; // static options
}

/** What the list emits when the user triggers a bulk edit. Either an explicit id
 *  list, or "all rows matching the current filter" (selectAll + filterQuery). */
export interface BulkSelection {
  ids?: string[];        // explicit selection (capped path)
  selectAll?: boolean;   // true = every row matching the current filter
  filterQuery?: string;  // filter/search query string (no paging) for selectAll
  count: number;         // how many records will be affected (for display)
}

export interface BulkEditConfig {
  entityName: string;          // e.g. "Customer", "Product", "Vendor"
  bulkUpdateUrl: string;       // e.g. "customers/bulk-update/"
  exportUrl: string;           // e.g. "customers/export-customers/"
  importUrl?: string;          // e.g. "customers/upload-excel/"
  templateUrl?: string;        // e.g. "customers/download-template/"
  fields: BulkField[];
  maxSelection?: number;       // default 100
}

@Injectable({ providedIn: 'root' })
export class BulkOperationsService {

  constructor(private http: HttpClient) {}

  /** Generate an empty form — all keys set to null (null = "no change") */
  getEmptyForm(fields: BulkField[]): Record<string, any> {
    return fields.reduce((acc, f) => ({ ...acc, [f.key]: null }), {});
  }

  /** Load all dropdown options in parallel; returns map of field.key → options[] */
  loadDropdownOptions(fields: BulkField[]): Observable<Record<string, any[]>> {
    const dropdownFields = fields.filter(f => f.type === 'dropdown' && f.url);
    if (dropdownFields.length === 0) {
      return new Observable(sub => { sub.next({}); sub.complete(); });
    }

    const requests: Record<string, Observable<any>> = {};
    dropdownFields.forEach(f => { requests[f.key] = this.http.get(f.url!); });

    return forkJoin(requests).pipe(
      map((results: any) => {
        const options: Record<string, any[]> = {};
        dropdownFields.forEach(f => {
          options[f.key] = results[f.key]?.data || results[f.key] || [];
        });
        return options;
      })
    );
  }

  /** Build update_data from form — only non-null fields included */
  buildUpdateData(fields: BulkField[], form: Record<string, any>): Record<string, any> {
    const data: Record<string, any> = {};
    for (const field of fields) {
      const val = form[field.key];
      if (val !== null && val !== undefined && val !== '') {
        data[field.apiKey] = val;
      }
    }
    return data;
  }

  /** Get human-readable list of changed field labels */
  getChangedLabels(fields: BulkField[], form: Record<string, any>): string[] {
    return fields
      .filter(f => {
        const v = form[f.key];
        return v !== null && v !== undefined && v !== '';
      })
      .map(f => f.label);
  }

  /** Execute bulk update PATCH.
   *  selectAll=true sends the filter query instead of an id list, so the server
   *  updates every matching row (all pages), not just the loaded selection. */
  bulkUpdate(
    url: string,
    ids: string[],
    updateData: Record<string, any>,
    selectAll = false,
    filterQuery = ''
  ): Observable<any> {
    const body: Record<string, any> = { update_data: updateData };
    if (selectAll) {
      body['select_all'] = true;
      body['filter_query'] = filterQuery;
    } else {
      body['ids'] = ids;
    }
    return this.http.patch(url, body);
  }

  /** Export to Excel — returns a Blob */
  exportToExcel(url: string, ids: string[]): Observable<Blob> {
    let exportUrl = url;
    if (ids.length > 0) {
      const separator = exportUrl.includes('?') ? '&' : '?';
      exportUrl += separator + 'ids=' + ids.join(',');
    }
    return this.http.get(exportUrl, { responseType: 'blob' });
  }

  /** Download Excel template */
  downloadTemplate(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  /** Import from Excel */
  importFromExcel(url: string, file: File, mode: 'create' | 'update' = 'create'): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const separator = url.includes('?') ? '&' : '?';
    const uploadUrl = mode === 'update' ? `${url}${separator}mode=update` : url;
    return this.http.post(uploadUrl, formData, {
      headers: { 'X-Skip-Error-Interceptor': 'true' }
    });
  }
}
