import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges,
  SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import {
  SalesReportDef, SummaryField,
  SUMMARY_KPI_REGISTRY,
} from '../sales-report-config';
import {
  FILTER_REGISTRY, ReportFilterControl, FilterOption,
} from '../report-filters.config';
import { ReportFilterOptionsService } from '../report-filter-options.service';

interface BarControl { key: string; control: ReportFilterControl; }

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminCommmonModule,
    NzSelectModule,
    NzPopoverModule,
  ],
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
})
export class ReportDetailComponent implements OnInit, OnChanges {
  @Input() report!: SalesReportDef;
  @Input() showBackButton = false;
  @Output() back = new EventEmitter<void>();

  registerType = 'general';

  tableConfig: TaTableConfig | null = null;
  hasSummary = false;
  summaryData: Record<string, any> = {};

  // ── Layer-2 filter state ───────────────────────────────────────────────
  /** Selected value per filter key (e.g. { customer: '<uuid>', status: 'Pending' }). */
  filterValues: Record<string, string> = {};
  /** Loaded dropdown options per filter key. */
  filterOptions: Record<string, FilterOption[]> = {};
  /** Resolved Layer-2 filter controls shown in the bar (stable; rebuilt per report). */
  barControls: BarControl[] = [];
  /** Resolved Layer-3 advanced filter controls shown in the "More Filters" drawer. */
  moreControls: BarControl[] = [];
  /** Whether the "More Filters" drawer is expanded. */
  moreFiltersOpen = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private filterOptionsSvc: ReportFilterOptionsService,
  ) {}

  ngOnInit(): void {
    this._initFilters();
    this._buildTableConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['report'] && !changes['report'].firstChange) {
      this.registerType = 'general';
      this.hasSummary = false;
      this.filterValues = {};
      this._initFilters();
      this._buildTableConfig();
    }
  }

  // ── Filters ────────────────────────────────────────────────────────────

  /** Resolve a list of filter keys into {key, control} pairs via the registry. */
  private _resolve(keys: string[] | undefined): BarControl[] {
    return (keys ?? [])
      .map((key) => ({ key, control: FILTER_REGISTRY[key] }))
      .filter((c) => !!c.control);
  }

  /** All filter controls (bar + drawer) — used for options, params and chips. */
  get allControls(): BarControl[] {
    return [...this.barControls, ...this.moreControls];
  }

  /** Resolve this report's filter controls and load their dropdown options. */
  private _initFilters(): void {
    this.barControls = this._resolve(this.report?.barFilters);
    this.moreControls = this._resolve(this.report?.moreFilters);
    this.moreFiltersOpen = false;

    this.filterOptions = {};
    for (const { key, control } of this.allControls) {
      // Stable empty array up front so [nzOptions] has a constant reference until
      // data arrives (avoids change-detection churn).
      this.filterOptions[key] = [];
      // No manual change detection here: static options emit synchronously and
      // HTTP options arrive inside zone.js, so Angular updates the view on its own.
      this.filterOptionsSvc.getOptions(control).subscribe((opts) => {
        this.filterOptions[key] = opts;
      });
    }
  }

  get hasMoreFilters(): boolean {
    return this.moreControls.length > 0;
  }

  /** Count of advanced (drawer) filters currently set — shown on the toggle. */
  get activeMoreCount(): number {
    return this.moreControls.filter(
      (c) => { const v = this.filterValues[c.key]; return v !== null && v !== undefined && v !== ''; }
    ).length;
  }

  /** A filter dropdown changed → re-query with the new filter set. */
  onFilterChange(): void {
    this._buildTableConfig();
  }

  /** Clear one filter (from its chip) and reload. */
  removeFilter(key: string): void {
    delete this.filterValues[key];
    this._buildTableConfig();
  }

  /** Clear all filters and reload. */
  clearFilters(): void {
    this.filterValues = {};
    this._buildTableConfig();
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.filterValues).some((v) => v !== null && v !== undefined && v !== '');
  }

  /** Active filters as removable chips: { key, label, valueLabel }. */
  get activeFilterChips(): { key: string; label: string; valueLabel: string }[] {
    const chips: { key: string; label: string; valueLabel: string }[] = [];
    for (const { key, control } of this.allControls) {
      const val = this.filterValues[key];
      if (val === null || val === undefined || val === '') continue;
      const opt = (this.filterOptions[key] ?? []).find((o) => o.value === val);
      chips.push({ key, label: control.label, valueLabel: opt ? opt.label : val });
    }
    return chips;
  }

  // ── Columns / register type ────────────────────────────────────────────

  /** True for multi-view "register" reports (Sale Register, Purchase Register…). */
  get isRegisterReport(): boolean {
    return !!(this.report?.registerTypes?.length && this.report?.registerCols);
  }

  get currentRegisterCols(): any[] {
    if (!this.isRegisterReport) return this.report?.cols ?? [];
    return this.report!.registerCols![this.registerType] ?? this.report!.cols;
  }

  hasFilter(key: string): boolean {
    return this.report?.filters?.includes(key as any) ?? false;
  }

  onRegisterTypeChange(): void {
    this._buildTableConfig();
  }

  // ── Summary strip ──────────────────────────────────────────────────────

  onDataLoaded(response: any): void {
    const s = response?.summary;
    this.hasSummary = !!(s && Object.keys(s).length > 0);
    this.summaryData = s || {};
    this.cdr.detectChanges();
  }

  /**
   * The fields rendered in the summary strip.
   * Shown ONLY for Sale Register, auto-derived from the backend's
   * response.summary via the global SUMMARY_KPI_REGISTRY (correct across all
   * 13 register views, never an empty "—").
   */
  get displayedSummaryFields(): SummaryField[] {
    if (!this.report?.showSummaryStrip) {
      return [];
    }
    return SUMMARY_KPI_REGISTRY.filter(
      (f) => this.summaryData[f.key] != null && this.summaryData[f.key] !== ''
    );
  }

  formatSummaryValue(field: SummaryField): string {
    const raw = this.summaryData[field.key];
    if (raw == null || raw === '') return '—';
    if (field.currency) {
      return `₹${Number(raw).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    const num = Number(raw);
    return isNaN(num) ? String(raw) : num.toLocaleString('en-IN');
  }

  // ── Table config ───────────────────────────────────────────────────────

  /** Append the active Layer-2 filter values as query params to the report URL. */
  private _appendFilterParams(url: string): string {
    let out = url;
    for (const { key, control } of this.allControls) {
      const val = this.filterValues[key];
      if (val === null || val === undefined || val === '') continue;
      const connector = out.includes('?') ? '&' : '?';
      out += `${connector}${control.param}=${encodeURIComponent(val)}`;
    }
    return out;
  }

  private _buildTableConfig(): void {
    if (!this.report) return;

    let url = this.report.apiUrl;
    if (this.isRegisterReport) {
      const connector = url.includes('?') ? '&' : '?';
      url += `${connector}register_type=${this.registerType}`;
    }
    url = this._appendFilterParams(url);

    const globalSearchKeys =
      this.isRegisterReport
        ? this.report.registerGlobalSearch?.[this.registerType] ?? this.report.globalSearch.keys
        : this.report.globalSearch.keys;

    this.tableConfig = null;
    this.hasSummary = false;

    setTimeout(() => {
      this.tableConfig = <TaTableConfig>{
        apiUrl: url,
        pkId: this.report.pkId,
        pageSize: 10,
        showDateFilters: this.report.showDateFilters ?? true,
        periodOnly: this.report.periodOnly ?? false,
        quickPeriodOptions: this.report.quickPeriodOptions,
        cols: this.currentRegisterCols,
        globalSearch: { keys: globalSearchKeys },
        export: {
          downloadName: `${this.report.name.replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyyMMdd', 'en')}`,
        },
        defaultSort: this.report.defaultSort ?? { key: 'id', value: 'descend' },
      };
      this.cdr.detectChanges();
    }, 0);
  }
}
