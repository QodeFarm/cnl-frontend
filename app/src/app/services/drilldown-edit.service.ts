import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DrilldownEditRequest {
  route: string;
  editId: string;
}

/**
 * Shared service for Account Ledger → source document drilldown.
 * Emits after navigation resolves so both fresh components (ngOnInit just ran)
 * and reused tab components (ngOnInit already ran, component is alive) receive it.
 */
@Injectable({ providedIn: 'root' })
export class DrilldownEditService {
  private request$ = new Subject<DrilldownEditRequest>();
  readonly editRequest$ = this.request$.asObservable();

  emit(route: string, editId: string): void {
    this.request$.next({ route, editId });
  }
}
