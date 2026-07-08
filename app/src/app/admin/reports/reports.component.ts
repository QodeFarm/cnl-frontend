import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ReportDetailComponent } from './sales-reports/report-detail/report-detail.component';
import { SALES_REPORTS, SalesReportDef } from './sales-reports/sales-report-config';
import { PURCHASE_REPORTS } from './purchase-reports/purchase-report-config';
import { INVENTORY_REPORTS } from './inventory-reports/inventory-report-config';
import { PRODUCTION_REPORTS } from './production-reports/production-report-config';
import { FINANCE_REPORTS } from './finance-reports/finance-report-config';
import { GST_REPORTS } from './gst-reports/gst-report-config';
import {
  ALL_REPORTS, MODULE_META, MODULE_ORDER,
  MasterReportDef, ReportModule,
} from './all-reports-config';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminCommmonModule,
    NzTagModule,
    ReportDetailComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {

  // ── View state ────────────────────────────────────────────────
  view: 'hub' | 'detail' = 'hub';
  selectedSalesReport: SalesReportDef | null = null;

  // ── Hub filter state ──────────────────────────────────────────
  searchText = '';
  activeModule: ReportModule | 'All' = 'All';

  // ── Config refs ───────────────────────────────────────────────
  readonly allReports = ALL_REPORTS;
  readonly moduleOrder = MODULE_ORDER;
  readonly moduleMeta = MODULE_META;

  constructor(private msg: NzMessageService, private router: Router) {}

  // ── Computed ──────────────────────────────────────────────────
  get filteredReports(): MasterReportDef[] {
    const q = this.searchText.trim().toLowerCase();
    return this.allReports.filter(r => {
      const matchModule = this.activeModule === 'All' || r.module === this.activeModule;
      const matchSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.module.toLowerCase().includes(q);
      return matchModule && matchSearch;
    });
  }

  get totalActive(): number {
    return this.allReports.filter(r => r.status === 'active').length;
  }

  get totalModules(): number {
    return MODULE_ORDER.length - 1; // exclude 'All'
  }

  getModuleCount(mod: ReportModule | 'All'): number {
    if (mod === 'All') return this.allReports.length;
    return this.allReports.filter(r => r.module === mod).length;
  }

  getModuleActiveCount(mod: ReportModule | 'All'): number {
    if (mod === 'All') return this.totalActive;
    return this.allReports.filter(r => r.module === mod && r.status === 'active').length;
  }

  // ── Navigation ────────────────────────────────────────────────
  openReport(report: MasterReportDef): void {
    const source =
      report.source === 'purchase' ? PURCHASE_REPORTS :
      report.source === 'inventory' ? INVENTORY_REPORTS :
      report.source === 'production' ? PRODUCTION_REPORTS :
      report.source === 'finance' ? FINANCE_REPORTS :
      report.source === 'gst' ? GST_REPORTS :
      SALES_REPORTS;
    const def = source.find(r => r.key === report.salesReportKey);
    if (def) {
      this.selectedSalesReport = def;
      this.view = 'detail';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  backToHub(): void {
    this.view = 'hub';
    this.selectedSalesReport = null;
  }

  setModule(mod: ReportModule | 'All'): void {
    this.activeModule = mod;
  }

  clearSearch(): void {
    this.searchText = '';
  }

  navigateToModule(mod: ReportModule, event: MouseEvent): void {
    event.stopPropagation();
    const route = this.moduleMeta[mod]?.route;
    if (route) this.router.navigate([route]);
  }

  getModuleMeta(mod: ReportModule | 'All') {
    if (mod === 'All') return null;
    return this.moduleMeta[mod];
  }
}
