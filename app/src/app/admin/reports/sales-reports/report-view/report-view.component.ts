import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ReportDetailComponent } from '../report-detail/report-detail.component';
import { SALES_REPORTS, SalesReportDef } from '../sales-report-config';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, ReportDetailComponent],
  templateUrl: './report-view.component.html',
})
export class ReportViewComponent implements OnInit, OnDestroy {
  report: SalesReportDef | null = null;
  notFound = false;
  private destroyed$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadReport();
    // Re-load when URL changes (same tab, different report)
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroyed$)
    ).subscribe(() => this.loadReport());
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private loadReport(): void {
    const key = this.router.url.split('?')[0].split('/').pop() ?? '';
    this.report = SALES_REPORTS.find(r => r.key === key) ?? null;
    this.notFound = !this.report;
  }
}
