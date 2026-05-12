import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AdminCommonService } from './admin-common.service';
import { DrilldownEditService } from './drilldown-edit.service';

/** Config for Type 1 pages: Parent-Child TaForm pattern (Sales, Purchase, Customers, etc.) */
export interface DblClickHandlerConfig {
  pkField: string;
  moduleName: string;
  sectionName: string;
  editEmitter: EventEmitter<any>;
}

/** Config for Type 2 pages: TaCurd drawer pattern (Bank Account, Cities, Users, etc.) */
export interface DblClickCurdConfig {
  // Lazily resolved at click time — curdModalComponent is available after ngAfterViewInit
  tableActionFn: (event: { action: { type: string }; data: any }) => void;
  moduleName: string;
  sectionName: string;
}

/** Config for Type 3/4 pages: cross-module drilldown (Account Ledger, Stock Summary, Reports) */
export interface DblClickNavigateConfig {
  // Called on dblclick to resolve route and id from the row (may return null to abort)
  resolveFn: (row: any) => { route: string; editId: string } | null;
  moduleName: string;
  sectionName: string;
}

@Injectable({ providedIn: 'root' })
export class DoubleClickNavigationService {

  constructor(
    private adminCommonService: AdminCommonService,
    private router: Router,
    private drilldownEditService: DrilldownEditService,
  ) {}

  /**
   * Type 1 — Parent-Child TaForm.
   * Emits row's PK to the parent edit emitter after permission check.
   */
  createHandler(config: DblClickHandlerConfig): (row: any) => void {
    return (row: any) => {
      if (!this.canAccess(config.moduleName, config.sectionName)) return;
      config.editEmitter.emit(row[config.pkField]);
    };
  }

  /**
   * Type 2 — TaCurd drawer.
   * Triggers the curd modal's edit (or view-only) drawer after permission check.
   */
  createCurdHandler(config: DblClickCurdConfig): (row: any) => void {
    return (row: any) => {
      if (this.canAccess(config.moduleName, config.sectionName)) {
        config.tableActionFn({ action: { type: 'edit' }, data: row });
      }
    };
  }

  /**
   * Type 3/4 — Cross-module drilldown (Account Ledger → source document).
   *
   * Two-phase approach so both fresh tabs and reused tabs work:
   *  1. Navigate with router state  → fresh tab: ngOnInit reads window.history.state
   *  2. Emit via DrilldownEditService after navigate resolves
   *     → reused tab: component already alive and subscribed, receives the event
   */
  createNavigateHandler(config: DblClickNavigateConfig): (row: any) => void {
    return (row: any) => {
      if (!this.canAccess(config.moduleName, config.sectionName)) return;
      const target = config.resolveFn(row);
      if (!target) return;
      this.router.navigate([target.route], { state: { editId: target.editId } })
        .then(() => this.drilldownEditService.emit(target.route, target.editId));
    };
  }

  /** Shortcut: navigate to a fixed route with editId, used by report components. */
  navigateTo(route: string, editId: string): void {
    if (!editId) return;
    this.router.navigate([route], { state: { editId } })
      .then(() => this.drilldownEditService.emit(route, editId));
  }

  private canAccess(moduleName: string, sectionName: string): boolean {
    // If permission list not yet loaded, allow — backend enforces actual auth
    if (this.adminCommonService.accessModuleList.length === 0) return true;

    // Look up the module (case-insensitive)
    const module = this.adminCommonService.accessModuleList.find(
      (mod: any) => mod.module_name?.toLowerCase() === moduleName.toLowerCase()
    );
    // If module not in permission list, don't block — naming may differ, backend is authoritative
    if (!module) return true;

    // Look up the section
    const section = (module.module_sections || []).find(
      (sec: any) => sec.section_name?.toLowerCase() === sectionName.toLowerCase()
    );
    // If section not registered under the module, don't block
    if (!section) return true;

    // Section found — only allow if Update or View action is granted
    return (section.actions || []).some(
      (act: any) => act.action_name?.toLowerCase() === 'update' || act.action_name?.toLowerCase() === 'view'
    );
  }
}
