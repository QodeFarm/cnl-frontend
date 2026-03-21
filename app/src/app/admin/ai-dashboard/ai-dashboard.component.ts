import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SiteConfigService } from '@ta/ta-core';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { WidgetShellComponent } from './components/widget-shell/widget-shell.component';
import { ChartWidgetComponent } from './widgets/chart-widget/chart-widget.component';
import { TableWidgetComponent } from './widgets/table-widget/table-widget.component';
import { InsightCard, ChartConfig, ChartType, TableConfig, DashboardWidget, DashboardPreferences, TabConfig, TabColumn, TabReportConfig } from './models/widget.models';
import { TAB_CONFIGS } from './tab-configs';

@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NzDatePickerModule, WidgetShellComponent, ChartWidgetComponent, TableWidgetComponent],
  templateUrl: './ai-dashboard.component.html',
  styleUrls: ['./ai-dashboard.component.scss']
})
export class AiDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  // Tab navigation
  activeTab: string = 'overview';

  // Low Stock
  lowStockData: any[] = [];
  lowStockSummary: any = { critical: 0, high: 0, medium: 0 };
  lowStockCount: number = 0;
  lowStockLoading: boolean = true;

  // Stock Forecast
  forecastData: any[] = [];
  forecastLoading: boolean = true;
  forecastRedCount: number = 0;
  forecastYellowCount: number = 0;
  forecastCriticalProduct: string = '';
  forecastCriticalDays: number = 0;

  // Debt Defaulters
  debtData: any[] = [];
  debtSummary: any = { critical: 0, warning: 0, mild: 0, total_overdue_amount: 0 };
  debtLoading: boolean = true;

  // Inactive Customers
  inactiveData: any[] = [];
  inactiveSummary: any = { lost: 0, critical: 0, warning: 0, at_risk: 0 };
  inactiveLoading: boolean = true;

  // Dead Stock
  deadStockData: any[] = [];
  deadStockSummary: any = { total_dead_products: 0, total_dead_stock_value: 0 };
  deadStockLoading: boolean = true;

  // Best Vendor
  bestVendorData: any[] = [];
  bestVendorSummary: any = { total_products_analyzed: 0, total_vendors_scored: 0 };
  bestVendorLoading: boolean = true;

  // Work Order Suggestions
  workOrderData: any[] = [];
  workOrderSummary: any = { total_suggestions: 0, ready_to_produce: 0, blocked_by_materials: 0 };
  workOrderLoading: boolean = true;
  workOrderCreating: boolean = false;

  // Auto Purchase Order
  purchaseOrderData: any[] = [];
  purchaseOrderSummary: any = { total_products_to_reorder: 0, total_estimated_cost: 0 };
  purchaseOrderLoading: boolean = true;
  purchaseOrderCreating: boolean = false;

  // Demand Forecast
  demandForecastData: any[] = [];
  demandForecastSummary: any = { total_analyzed: 0, trending_up: 0, trending_down: 0, at_risk: 0 };
  demandForecastLoading: boolean = true;

  // Churn Risk (RFM)
  churnRiskData: any[] = [];
  churnRiskSummary: any = { total_customers: 0, champions: 0, loyal: 0, at_risk: 0, needs_attention: 0, lost: 0, new_customers: 0 };
  churnRiskLoading: boolean = true;

  // Cash Flow Forecast
  cashFlowData: any[] = [];
  cashFlowSummary: any = { total_inflow: 0, total_outflow: 0, net_flow: 0, risk_level: 'LOW', lowest_cumulative: 0 };
  cashFlowLoading: boolean = true;

  // Expense Anomaly
  expenseAnomalyData: any[] = [];
  expenseAnomalySummary: any = { total_anomalies: 0, critical: 0, warning: 0, total_excess_amount: 0, categories_affected: 0 };
  expenseAnomalyLoading: boolean = true;

  // Price Variance
  priceVarianceData: any[] = [];
  priceVarianceSummary: any = { total_overspend: 0, products_analyzed: 0, vendors_compared: 0, overspend_items: 0, increasing_price_trends: 0 };
  priceVarianceLoading: boolean = true;

  // Raw Material Forecast
  rawMaterialData: any[] = [];
  rawMaterialSummary: any = { total_raw_materials: 0, critical_count: 0, warning_count: 0, safe_count: 0 };
  rawMaterialLoading: boolean = true;

  // Profit Margin
  profitMarginData: any[] = [];
  profitMarginSummary: any = { total_products: 0, red_count: 0, yellow_count: 0, green_count: 0, total_revenue: 0, total_cost: 0, total_profit: 0, overall_margin: 0 };
  profitMarginLoading: boolean = true;

  // Money Bleeding
  moneyBleedingData: any[] = [];
  moneyBleedingSummary: any = { total_bleeding: 0, total_categories: 0, critical_count: 0, high_count: 0, modules_affected: 0, module_breakdown: [] };
  moneyBleedingLoading: boolean = true;

  // Seasonality Heatmap
  seasonalityData: any[] = [];
  seasonalitySummary: any = { total_products_analyzed: 0, products_with_seasonal_peaks: 0, products_with_seasonal_lows: 0, busiest_month: '', slowest_month: '', month_totals: [] };
  seasonalityLoading: boolean = true;

  // What-If Simulator
  whatIfData: any[] = [];
  whatIfSummary: any = { growth_pct: 20, forecast_months: 3, total_materials_analyzed: 0, materials_short: 0, materials_ok: 0, total_additional_cost: 0, can_handle_growth: true, products_simulated: 0 };
  whatIfLoading: boolean = true;
  whatIfGrowthPct: number = 20;
  whatIfForecastMonths: number = 3;

  // Date Range Filter
  datePreset: string = '';
  dateRange: [Date, Date] | null = null;

  // Charts — Overview (kept as @ViewChild since overview has unique layout)
  @ViewChild('overviewRadarCanvas') overviewRadarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('overviewSeverityCanvas') overviewSeverityCanvas!: ElementRef<HTMLCanvasElement>;
  overviewRadarChart: any = null;
  overviewSeverityChart: any = null;

  // Charts — Dynamic data tabs (generic map replaces 11 individual @ViewChild + instances)
  charts: Record<string, any> = {};
  chartModes: Record<string, string> = {};

  // Chart type modes — Overview only
  overviewChartMode: string = 'radar';
  overviewSeverityMode: string = 'bar';

  // Department health (overview)
  departmentHealth: any[] = [];
  materialListCache: any[] = [];

  // Modal — unified quickview
  quickviewOpen: boolean = false;
  quickviewType: string = '';
  quickviewTitle: string = '';
  quickviewStats: any[] = [];
  quickviewDrillLabel: string = 'View Details';
  @ViewChild('quickviewChartCanvas') quickviewChartCanvas!: ElementRef<HTMLCanvasElement>;
  quickviewChart: any = null;

  // Toast
  toastMessage: string = '';
  toastType: string = 'success';
  toastVisible: boolean = false;

  // Cached insights (prevents template method calls = no change detection loops)
  allDataLoaded: boolean = false;
  overviewInsight: string = 'Analyzing your business data...';
  financeInsight: string = '';
  salesInsight: string = '';
  inventoryInsight: string = '';
  purchaseInsight: string = '';
  productionInsight: string = '';
  priorityActions: any[] = [];

  // Smart Alerts Bar
  smartAlerts: any[] = [];
  alertBarPaused: boolean = false;

  // Smart Insight Cards — severity-sorted
  cardChartTypes: { [id: string]: ChartType } = {};
  cardViewModes: { [id: string]: string } = {};
  hiddenCards: string[] = [];
  insightCards: InsightCard[] = [];
  criticalCards: InsightCard[] = [];
  warningCards: InsightCard[] = [];
  healthyCards: InsightCard[] = [];

  // ─── Customization Drawer ───
  customDrawerOpen: boolean = false;
  dashboardWidgets: DashboardWidget[] = [];
  private readonly PREFS_KEY = 'ai_dashboard_prefs';

  // ─── Dynamic Tab System ───
  tabConfigs: TabConfig[] = TAB_CONFIGS;
  tabCards: Record<string, { colClass: string; title: string; indicatorClass: string; value: string | number; subtitle: string }[]> = {};
  self: any = this;
  private destroy$ = new Subject<void>();
  private timers: ReturnType<typeof setTimeout>[] = [];
  private insightTimer: ReturnType<typeof setTimeout> | null = null;
  widgetVisibility: Record<string, boolean> = {};
  private visibilityObs: IntersectionObserver | null = null;
  private wasHidden = false;

  constructor(private http: HttpClient, private siteConfigService: SiteConfigService, private router: Router, private cdr: ChangeDetectorRef, private elRef: ElementRef) {
    this._initWidgetRegistry();
    this._rebuildVisibilityCache();
    this._loadPreferences();
  }

  get baseUrl(): string {
    return this.siteConfigService.CONFIG?.baseUrl || '';
  }

  // ─── Date Range Filter ───

  private apiUrl(path: string, extraParams?: string): string {
    const parts: string[] = [];
    if (this.dateRange?.[0] && this.dateRange?.[1]) {
      const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      parts.push(`from_date=${fmt(this.dateRange[0])}`);
      parts.push(`to_date=${fmt(this.dateRange[1])}`);
    }
    if (extraParams) parts.push(extraParams);
    return this.baseUrl + path + (parts.length ? '?' + parts.join('&') : '');
  }

  setDatePreset(preset: string) {
    if (this.datePreset === preset) { this.clearDateFilter(); return; }
    this.datePreset = preset;
    const now = new Date();
    const from = new Date();
    switch (preset) {
      case '7d': from.setDate(now.getDate() - 7); break;
      case '30d': from.setDate(now.getDate() - 30); break;
      case '90d': from.setDate(now.getDate() - 90); break;
      case 'quarter':
        const q = Math.floor(now.getMonth() / 3);
        from.setFullYear(now.getFullYear(), q * 3, 1);
        from.setHours(0, 0, 0, 0);
        break;
      case 'fy':
        from.setFullYear(now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1, 3, 1);
        from.setHours(0, 0, 0, 0);
        break;
      case '12m': from.setFullYear(now.getFullYear() - 1, now.getMonth(), now.getDate()); break;
    }
    this.dateRange = [from, now];
    this.fetchAllData();
  }

  onDateRangeChange(range: [Date, Date] | null) {
    this.dateRange = range;
    this.datePreset = range ? 'custom' : '';
    if (range?.[0] && range?.[1]) this.fetchAllData();
  }

  clearDateFilter() {
    this.dateRange = null;
    this.datePreset = '';
    this.fetchAllData();
  }

  ngOnInit() {
    Chart.register(...registerables);
    this.rebuildCards();
    this.fetchAllData();
  }

  ngAfterViewInit() {
    this.visibilityObs = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && this.wasHidden && this.allDataLoaded) {
          this.cdr.detectChanges();
          this.scheduleTimer(() => this.initChartsForTab(this.activeTab), 100);
        }
        this.wasHidden = !visible;
      },
      { threshold: 0.1 }
    );
    this.visibilityObs.observe(this.elRef.nativeElement);
  }

  ngOnDestroy() {
    this.visibilityObs?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
    this.timers.forEach(t => clearTimeout(t));
    if (this.insightTimer) clearTimeout(this.insightTimer);
    // Overview charts
    this.overviewRadarChart?.destroy();
    this.overviewSeverityChart?.destroy();
    this.quickviewChart?.destroy();
    // Dynamic data tab charts
    Object.values(this.charts).forEach(c => c?.destroy());
  }

  private scheduleTimer(fn: () => void, ms: number) {
    this.timers.push(setTimeout(fn, ms));
  }

  // ─── Tab Navigation ───

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.cdr.detectChanges();
    this.scheduleTimer(() => this.initChartsForTab(tab), 150);
    this.scheduleTimer(() => this.initChartsForTab(tab), 600);
  }

  // ─── Fetch All Data ───

  fetchAllData() {
    this.fetchLowStock();
    this.fetchStockForecast();
    this.fetchDebtDefaulters();
    this.fetchInactiveCustomers();
    this.fetchDeadStock();
    this.fetchBestVendors();
    this.fetchWorkOrderSuggestions();
    this.fetchPurchaseOrderSuggestions();
    this.fetchDemandForecast();
    this.fetchChurnRisk();
    this.fetchCashFlowForecast();
    this.fetchExpenseAnomalies();
    this.fetchPriceVariance();
    this.fetchRawMaterialForecast();
    this.fetchProfitMargin();
    this.fetchMoneyBleeding();
    this.fetchSeasonality();
    this.fetchWhatIf();
  }

  // ─── Low Stock ───

  fetchLowStock() {
    this.lowStockLoading = true;
    this.http.get(this.apiUrl('smart-insights/low-stock/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.lowStockData = res.data || [];
        this.lowStockSummary = res.summary || { critical: 0, high: 0, medium: 0 };
        this.lowStockCount = res.count || 0;
        this.lowStockLoading = false;
        this.updateInsights();
        if (this.activeTab === 'inventory') this.scheduleTimer(() => this.renderChart('stockHealth'), 200);
      },
      () => { this.lowStockLoading = false; this.updateInsights(); }
    );
  }

  getSeverityLabel(severity: string): string {
    return severity === 'critical' ? 'Out of Stock' : severity === 'high' ? 'High Risk' : 'Low Stock';
  }

  // ─── Stock Forecast ───

  fetchStockForecast() {
    this.forecastLoading = true;
    this.http.get(this.apiUrl('smart-insights/stock-forecast/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.forecastData = res.data || [];
        const summary = res.summary || {};
        this.forecastRedCount = summary.red || 0;
        this.forecastYellowCount = summary.yellow || 0;
        if (this.forecastData.length > 0) {
          this.forecastCriticalProduct = this.forecastData[0].name;
          this.forecastCriticalDays = this.forecastData[0].days_remaining;
        }
        this.forecastLoading = false;
        this.updateInsights();
        if (this.activeTab === 'inventory') this.scheduleTimer(() => this.renderChart('topAtRisk'), 200);
      },
      () => { this.forecastLoading = false; this.updateInsights(); }
    );
  }

  getDaysRemainingClass(days: number): string {
    if (days <= 0) return 'days-critical';
    if (days <= 15) return 'days-danger';
    if (days <= 30) return 'days-warning';
    return 'days-safe';
  }

  // ─── Debt Defaulters ───

  fetchDebtDefaulters() {
    this.debtLoading = true;
    this.http.get(this.apiUrl('smart-insights/debt-defaulters/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.debtData = res.data || [];
        this.debtSummary = res.summary || { critical: 0, warning: 0, mild: 0, total_overdue_amount: 0 };
        this.debtLoading = false;
        this.updateInsights();
        if (this.activeTab === 'finance') this.scheduleTimer(() => this.renderChart('debt'), 200);
      },
      () => { this.debtLoading = false; this.updateInsights(); }
    );
  }

  // ─── Inactive Customers ───

  fetchInactiveCustomers() {
    this.inactiveLoading = true;
    this.http.get(this.apiUrl('smart-insights/inactive-customers/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.inactiveData = res.data || [];
        this.inactiveSummary = res.summary || { lost: 0, critical: 0, warning: 0, at_risk: 0 };
        this.inactiveLoading = false;
        this.updateInsights();
        if (this.activeTab === 'sales') this.scheduleTimer(() => this.renderChart('inactive'), 200);
      },
      () => { this.inactiveLoading = false; this.updateInsights(); }
    );
  }

  // ─── Dead Stock ───

  fetchDeadStock() {
    this.deadStockLoading = true;
    this.http.get(this.apiUrl('smart-insights/dead-stock/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.deadStockData = res.data || [];
        this.deadStockSummary = res.summary || { total_dead_products: 0, total_dead_stock_value: 0 };
        this.deadStockLoading = false;
        this.updateInsights();
      },
      () => { this.deadStockLoading = false; this.updateInsights(); }
    );
  }

  // ─── Best Vendor ───

  fetchBestVendors() {
    this.bestVendorLoading = true;
    this.http.get(this.apiUrl('smart-insights/best-vendor/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.bestVendorData = res.data || [];
        this.bestVendorSummary = res.summary || { total_products_analyzed: 0, total_vendors_scored: 0 };
        this.bestVendorLoading = false;
        this.updateInsights();
        if (this.activeTab === 'purchase') this.scheduleTimer(() => this.renderChart('vendorScore'), 200);
      },
      () => { this.bestVendorLoading = false; this.updateInsights(); }
    );
  }

  getBestVendor(item: any): any {
    return item.vendors?.find((v: any) => v.is_best) || item.vendors?.[0] || {};
  }

  // ─── Work Order Suggestions ───

  fetchWorkOrderSuggestions() {
    this.workOrderLoading = true;
    this.http.get(this.apiUrl('smart-insights/work-order-suggestions/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.workOrderData = res.data || [];
        this.workOrderSummary = res.summary || { total_suggestions: 0, ready_to_produce: 0, blocked_by_materials: 0 };
        this.workOrderLoading = false;
        this.updateInsights();
        this._updateMaterialListCache();
        if (this.activeTab === 'production') {
          this.scheduleTimer(() => this.renderChart('production'), 200);
          this.scheduleTimer(() => this.renderChart('material'), 200);
        }
      },
      () => { this.workOrderLoading = false; this.updateInsights(); }
    );
  }

  createWorkOrder(item: any) {
    if (this.workOrderCreating) return;
    const qty = item.can_produce ? item.suggested_qty : item.max_producible_qty;
    if (qty <= 0) {
      this.showToast('Cannot create: insufficient raw materials', 'error');
      return;
    }
    this.workOrderCreating = true;
    this.http.post(this.baseUrl + 'smart-insights/work-order-suggestions/', {
      items: [{ product_id: item.product_id, quantity: qty }]
    }).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.workOrderCreating = false;
        if (res.data?.length > 0) {
          this.showToast(`Work Order created for ${item.product_name} (Qty: ${qty})`, 'success');
          this.fetchWorkOrderSuggestions();
          this.fetchLowStock();
        } else {
          const errorMsg = res.errors?.[0]?.error || 'Failed to create work order';
          this.showToast(errorMsg, 'error');
        }
      },
      () => { this.workOrderCreating = false; this.showToast('Failed to create work order', 'error'); }
    );
  }

  // ─── Auto Purchase Order ───

  fetchPurchaseOrderSuggestions() {
    this.purchaseOrderLoading = true;
    this.http.get(this.apiUrl('smart-insights/auto-purchase-order/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.purchaseOrderData = res.data || [];
        this.purchaseOrderSummary = res.summary || { total_products_to_reorder: 0, total_estimated_cost: 0 };
        this.purchaseOrderLoading = false;
        this.updateInsights();
        if (this.activeTab === 'purchase') this.scheduleTimer(() => this.renderChart('purchase'), 200);
      },
      () => { this.purchaseOrderLoading = false; this.updateInsights(); }
    );
  }

  createPurchaseOrder(item: any) {
    if (this.purchaseOrderCreating) return;
    this.purchaseOrderCreating = true;
    this.http.post(this.baseUrl + 'smart-insights/auto-purchase-order/', {
      items: [{
        product_id: item.product_id,
        vendor_id: item.best_vendor_id,
        quantity: item.reorder_qty,
        rate: item.latest_rate
      }]
    }).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.purchaseOrderCreating = false;
        if (res.data?.length > 0) {
          this.showToast(`PO ${res.data[0].order_no} created for ${item.product_name}`, 'success');
          this.fetchPurchaseOrderSuggestions();
        } else {
          this.showToast('Failed to create purchase order', 'error');
        }
      },
      () => { this.purchaseOrderCreating = false; this.showToast('Failed to create purchase order', 'error'); }
    );
  }

  // ─── Demand Forecast ───

  fetchDemandForecast() {
    this.demandForecastLoading = true;
    this.http.get(this.apiUrl('smart-insights/demand-forecast/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.demandForecastData = res.data || [];
        const dfDefaults = { total_analyzed: 0, trending_up: 0, trending_down: 0, at_risk: 0 };
        this.demandForecastSummary = { ...dfDefaults, ...(res.summary || {}) };
        this.demandForecastLoading = false;
        this.updateInsights();
      },
      () => { this.demandForecastLoading = false; this.updateInsights(); }
    );
  }

  getTrendClass(trend: string): string {
    if (trend === 'UP') return 'ai-badge-green';
    if (trend === 'DOWN') return 'ai-badge-red';
    return 'ai-badge-blue';
  }

  getDemandRiskClass(risk: string): string {
    if (risk === 'CRITICAL') return 'ai-badge-red';
    if (risk === 'HIGH') return 'ai-badge-yellow';
    return 'ai-badge-green';
  }

  // ─── Churn Risk ───

  fetchChurnRisk() {
    this.churnRiskLoading = true;
    this.http.get(this.apiUrl('smart-insights/churn-risk/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.churnRiskData = res.data || [];
        const raw = res.summary || {};
        this.churnRiskSummary = {
          total_customers: raw.total_customers || 0,
          champions: raw.champion || raw.champions || 0,
          loyal: raw.loyal || 0,
          at_risk: raw.at_risk || 0,
          needs_attention: raw.needs_attention || 0,
          lost: raw.lost || 0,
          new_customers: raw.new || raw.new_customers || 0
        };
        this.churnRiskLoading = false;
        this.updateInsights();
        if (this.activeTab === 'sales') this.scheduleTimer(() => this.renderChart('churnRisk'), 200);
      },
      () => { this.churnRiskLoading = false; this.updateInsights(); }
    );
  }

  getSegmentClass(segment: string): string {
    switch (segment) {
      case 'CHAMPION': return 'ai-badge-green';
      case 'LOYAL': return 'ai-badge-blue';
      case 'AT_RISK': case 'NEEDS_ATTENTION': return 'ai-badge-yellow';
      case 'LOST': return 'ai-badge-dark';
      case 'NEW': return 'ai-badge-blue';
      default: return 'ai-badge-blue';
    }
  }

  getSegmentLabel(segment: string): string {
    return segment.replace(/_/g, ' ');
  }

  // ─── Cash Flow Forecast ───

  fetchCashFlowForecast() {
    this.cashFlowLoading = true;
    this.http.get(this.apiUrl('smart-insights/cash-flow-forecast/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        const rawData = res.data;
        this.cashFlowData = Array.isArray(rawData) ? rawData : (rawData?.weekly_data || []);
        const cfDefaults = { total_inflow: 0, total_outflow: 0, net_flow: 0, risk_level: 'LOW', lowest_cumulative: 0 };
        const rawSummary = res.summary || rawData?.summary || {};
        this.cashFlowSummary = {
          ...cfDefaults,
          total_inflow: rawSummary.total_expected_inflow || rawSummary.total_inflow || 0,
          total_outflow: rawSummary.total_expected_outflow || rawSummary.total_outflow || 0,
          net_flow: rawSummary.net_cash_flow || rawSummary.net_flow || 0,
          risk_level: rawSummary.risk || rawSummary.risk_level || 'LOW',
          lowest_cumulative: rawSummary.lowest_point || rawSummary.lowest_cumulative || 0
        };
        this.cashFlowLoading = false;
        this.updateInsights();
        if (this.activeTab === 'finance') this.scheduleTimer(() => this.renderChart('cashFlow'), 200);
      },
      () => { this.cashFlowLoading = false; this.updateInsights(); }
    );
  }

  getCashFlowRiskClass(risk: string): string {
    if (risk === 'HIGH') return 'indicator-red';
    if (risk === 'MEDIUM') return 'indicator-yellow';
    return 'indicator-green';
  }

  // ─── Expense Anomaly ───

  fetchExpenseAnomalies() {
    this.expenseAnomalyLoading = true;
    this.http.get(this.apiUrl('smart-insights/expense-anomaly/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.expenseAnomalyData = res.data || [];
        const eaDefaults = { total_anomalies: 0, critical: 0, warning: 0, total_excess_amount: 0, categories_affected: 0 };
        this.expenseAnomalySummary = { ...eaDefaults, ...(res.summary || {}) };
        this.expenseAnomalyLoading = false;
        this.updateInsights();
      },
      () => { this.expenseAnomalyLoading = false; this.updateInsights(); }
    );
  }

  // ─── Price Variance ───

  fetchPriceVariance() {
    this.priceVarianceLoading = true;
    this.http.get(this.apiUrl('smart-insights/price-variance/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.priceVarianceData = res.data || [];
        const pvDefaults = { total_overspend: 0, products_analyzed: 0, vendors_compared: 0, overspend_items: 0, increasing_price_trends: 0 };
        this.priceVarianceSummary = { ...pvDefaults, ...(res.summary || {}) };
        this.priceVarianceLoading = false;
        this.updateInsights();
        if (this.activeTab === 'purchase') this.scheduleTimer(() => this.renderChart('priceCompare'), 200);
      },
      () => { this.priceVarianceLoading = false; this.updateInsights(); }
    );
  }

  getPriceTrendClass(trend: string): string {
    if (trend === 'INCREASING') return 'ai-badge-red';
    if (trend === 'DECREASING') return 'ai-badge-green';
    return 'ai-badge-blue';
  }

  // ─── Raw Material Forecast ───

  fetchRawMaterialForecast() {
    this.rawMaterialLoading = true;
    this.http.get(this.apiUrl('smart-insights/raw-material-forecast/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.rawMaterialData = res.data || [];
        this.rawMaterialSummary = res.summary || { total_raw_materials: 0, critical_count: 0, warning_count: 0, safe_count: 0 };
        this.rawMaterialLoading = false;
        this.updateInsights();
        if (this.activeTab === 'production') this.scheduleTimer(() => this.renderChart('rawMaterial'), 200);
      },
      () => { this.rawMaterialLoading = false; this.updateInsights(); }
    );
  }

  // ─── Profit Margin ───

  fetchProfitMargin() {
    this.profitMarginLoading = true;
    this.http.get(this.apiUrl('smart-insights/profit-margin/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.profitMarginData = res.data || [];
        this.profitMarginSummary = res.summary || { total_products: 0, red_count: 0, yellow_count: 0, green_count: 0, total_revenue: 0, total_cost: 0, total_profit: 0, overall_margin: 0 };
        this.profitMarginLoading = false;
        this.updateInsights();
        if (this.activeTab === 'finance') this.scheduleTimer(() => this.renderChart('profitMargin'), 200);
      },
      () => { this.profitMarginLoading = false; this.updateInsights(); }
    );
  }

  getMarginStatusClass(status: string): string {
    if (status === 'RED') return 'ai-badge-red';
    if (status === 'YELLOW') return 'ai-badge-yellow';
    return 'ai-badge-green';
  }

  // ─── Money Bleeding ───

  fetchMoneyBleeding() {
    this.moneyBleedingLoading = true;
    this.http.get(this.apiUrl('smart-insights/money-bleeding/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.moneyBleedingData = res.data || [];
        this.moneyBleedingSummary = res.summary || { total_bleeding: 0, total_categories: 0, critical_count: 0, high_count: 0, modules_affected: 0, module_breakdown: [] };
        this.moneyBleedingLoading = false;
        this.updateInsights();
        if (this.activeTab === 'finance') this.scheduleTimer(() => this.renderChart('moneyBleeding'), 200);
      },
      () => { this.moneyBleedingLoading = false; this.updateInsights(); }
    );
  }

  getBleedingSeverityClass(severity: string): string {
    if (severity === 'CRITICAL') return 'ai-badge-red';
    if (severity === 'HIGH') return 'ai-badge-yellow';
    if (severity === 'MEDIUM') return 'ai-badge-blue';
    return 'ai-badge-green';
  }

  // ─── Seasonality Heatmap ───

  fetchSeasonality() {
    this.seasonalityLoading = true;
    this.http.get(this.apiUrl('smart-insights/seasonality-heatmap/')).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.seasonalityData = res.data || [];
        this.seasonalitySummary = res.summary || { total_products_analyzed: 0, products_with_seasonal_peaks: 0, products_with_seasonal_lows: 0, busiest_month: '', slowest_month: '', month_totals: [] };
        this.seasonalityLoading = false;
        this.updateInsights();
        if (this.activeTab === 'sales') this.scheduleTimer(() => this.renderChart('seasonality'), 200);
      },
      () => { this.seasonalityLoading = false; this.updateInsights(); }
    );
  }

  getSeasonalityIntensityClass(intensity: string): string {
    if (intensity === 'PEAK') return 'ai-badge-red';
    if (intensity === 'ABOVE_AVG') return 'ai-badge-yellow';
    if (intensity === 'NORMAL') return 'ai-badge-blue';
    if (intensity === 'LOW') return 'ai-badge-green';
    return '';
  }

  fetchWhatIf(growthPct: number = 20, forecastMonths: number = 3) {
    this.whatIfLoading = true;
    this.http.get(this.apiUrl('smart-insights/what-if-simulator/', 'growth_pct=' + growthPct + '&forecast_months=' + forecastMonths)).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        this.whatIfData = res.data || [];
        this.whatIfSummary = res.summary || { growth_pct: growthPct, forecast_months: forecastMonths, total_materials_analyzed: 0, materials_short: 0, materials_ok: 0, total_additional_cost: 0, can_handle_growth: true, products_simulated: 0 };
        this.whatIfLoading = false;
        this.updateInsights();
        if (this.activeTab === 'production') this.scheduleTimer(() => this.renderChart('whatIf'), 200);
      },
      () => { this.whatIfLoading = false; this.updateInsights(); }
    );
  }

  runWhatIf() {
    const pct = Math.max(1, Math.min(200, this.whatIfGrowthPct || 20));
    const months = Math.max(1, Math.min(24, this.whatIfForecastMonths || 3));
    this.whatIfGrowthPct = pct;
    this.whatIfForecastMonths = months;
    this.fetchWhatIf(pct, months);
  }

  // ─── Charts ───

  initChartsForTab(tab: string) {
    if (tab === 'overview') {
      this.initOverviewRadarChart();
      this.initOverviewSeverityChart();
      return;
    }
    const cfg = this.tabConfigs.find(t => t.key === tab);
    if (!cfg) return;
    cfg.reports.forEach(r => {
      if (this.isWidgetVisible(r.widgetId)) {
        this.renderChart(r.chart.id);
      }
    });
  }

  switchChart(section: string, type: string) {
    if (section === 'overview') { this.overviewChartMode = type; this.initOverviewRadarChart(); return; }
    if (section === 'overviewSeverity') { this.overviewSeverityMode = type; this.initOverviewSeverityChart(); return; }
    this.chartModes[section] = type;
    this.renderChart(section);
  }

  // ─── Generic Chart Renderer ───

  renderChart(chartId: string) {
    const el = document.getElementById('chart-' + chartId) as HTMLCanvasElement;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    if (this.charts[chartId]) this.charts[chartId].destroy();
    const report = this._findReport(chartId);
    if (!report) return;
    const mode = this.chartModes[chartId] || report.chart.defaultMode;
    const config = report.chart.build(this, mode);
    if (config) this.charts[chartId] = new Chart(ctx, config);
  }

  getChartMode(chartId: string): string {
    const report = this._findReport(chartId);
    return this.chartModes[chartId] || report?.chart.defaultMode || 'bar';
  }

  private _findReport(chartId: string): TabReportConfig | null {
    for (const tab of this.tabConfigs) {
      for (const r of tab.reports) {
        if (r.chart.id === chartId) return r;
      }
    }
    return null;
  }

  // ─── Dynamic Template Helpers ───

  prop(key: string): any {
    return (this as any)[key];
  }

  getCellClass(col: TabColumn, item: any): string {
    if (!col.cellClass) return '';
    if (typeof col.cellClass === 'string') return col.cellClass;
    return col.cellClass(item);
  }

  handleAction(handler: string, item: any) {
    if (handler === 'createPurchaseOrder') this.createPurchaseOrder(item);
    else if (handler === 'createWorkOrder') this.createWorkOrder(item);
  }

  navigateTo(route: string | ((item: any) => string), item?: any) {
    try {
      let path = typeof route === 'function' ? route(item) : route;
      if (path) {
        if (!path.startsWith('/admin')) path = '/admin' + path;
        this.router.navigate([path]);
      }
    } catch (e) {
      console.error('Navigation error:', e);
    }
  }

  private _cacheTabCards() {
    this.tabConfigs.forEach(tab => {
      const cached = tab.cards.map(c => ({
        colClass: c.colClass,
        title: c.title,
        indicatorClass: c.indicatorClass(this),
        value: c.value(this),
        subtitle: c.subtitle(this)
      }));
      const existing = this.tabCards[tab.key];
      if (existing && existing.length === cached.length) {
        cached.forEach((c, i) => {
          existing[i].indicatorClass = c.indicatorClass;
          existing[i].value = c.value;
          existing[i].subtitle = c.subtitle;
        });
      } else {
        this.tabCards[tab.key] = cached;
      }
    });
  }

  trackTabCard(index: number, card: any): string {
    return card.title;
  }

  trackDeptCard(index: number, dept: any): string {
    return dept.tab;
  }

  trackAlert(index: number, alert: any): string {
    return alert.title;
  }

  // ─── Overview Charts ───

  private _getDeptScore(critical: number, warning: number, normal: number): number {
    const total = critical + warning + normal;
    if (total === 0) return 100;
    return Math.max(0, Math.round(100 - (critical * 30 + warning * 10 + normal * 2)));
  }

  initOverviewRadarChart() {
    if (!this.overviewRadarCanvas?.nativeElement) return;
    const ctx = this.overviewRadarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.overviewRadarChart) this.overviewRadarChart.destroy();

    const type = this.overviewChartMode as any;
    const scores = [
      this._getDeptScore(this.lowStockSummary.critical, this.lowStockSummary.high, this.lowStockSummary.medium),
      this._getDeptScore(this.debtSummary.critical, this.debtSummary.warning, this.debtSummary.mild),
      this._getDeptScore(this.inactiveSummary.lost + this.inactiveSummary.critical, this.inactiveSummary.warning, this.inactiveSummary.at_risk),
      this._getDeptScore(this.priceVarianceSummary.overspend_items, this.priceVarianceSummary.increasing_price_trends, 0),
      this._getDeptScore(this.workOrderSummary.blocked_by_materials, 0, this.workOrderSummary.ready_to_produce)
    ];
    const labels = ['Inventory', 'Finance', 'Sales', 'Purchase', 'Production'];
    const colors = ['#394c8f', '#5b6abf', '#7b8cd4', '#9eadea', '#c2cef5'];

    if (type === 'radar') {
      this.overviewRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [{
            label: 'Health Score',
            data: scores,
            backgroundColor: 'rgba(57, 76, 143, 0.15)',
            borderColor: '#394c8f',
            borderWidth: 2,
            pointBackgroundColor: scores.map(s => s < 50 ? '#ff4d4f' : s < 75 ? '#faad14' : '#52c41a'),
            pointBorderColor: '#fff',
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, aspectRatio: 1,
          scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 25, font: { size: 10 }, backdropColor: 'transparent' }, grid: { color: '#e0e0e0' }, pointLabels: { font: { size: 12, weight: 'bold' }, color: '#2c2e35' } } },
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Department Health Score', color: '#2c2e35', font: { size: 14, weight: 'bold' }, padding: { bottom: 4 } }
          }
        }
      });
    } else if (type === 'polarArea') {
      this.overviewRadarChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels,
          datasets: [{ data: scores, backgroundColor: ['rgba(255,77,79,0.6)', 'rgba(250,173,20,0.6)', 'rgba(24,144,255,0.6)', 'rgba(82,196,26,0.6)', 'rgba(57,76,143,0.6)'], borderColor: '#fff', borderWidth: 2 }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, aspectRatio: 1,
          scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 25, font: { size: 10 }, backdropColor: 'transparent' } } },
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10, usePointStyle: true } },
            title: { display: true, text: 'Department Health Score', color: '#2c2e35', font: { size: 14, weight: 'bold' }, padding: { bottom: 4 } }
          }
        }
      });
    } else {
      this.overviewRadarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Health Score', data: scores, backgroundColor: scores.map(s => s < 50 ? '#ff4d4f' : s < 75 ? '#faad14' : '#52c41a'), borderRadius: 6, barPercentage: 0.5 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          indexAxis: 'y',
          scales: { x: { beginAtZero: true, max: 100, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#555' } }, y: { grid: { display: false }, ticks: { font: { size: 12, weight: 'bold' }, color: '#2c2e35' } } },
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Department Health Score', color: '#2c2e35', font: { size: 14, weight: 'bold' }, padding: { bottom: 4 } }
          }
        }
      });
    }
  }

  initOverviewSeverityChart() {
    if (!this.overviewSeverityCanvas?.nativeElement) return;
    const ctx = this.overviewSeverityCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.overviewSeverityChart) this.overviewSeverityChart.destroy();

    const type = this.overviewSeverityMode as any;
    const critTotal = this.lowStockSummary.critical + this.debtSummary.critical + (this.inactiveSummary.lost || 0) + (this.inactiveSummary.critical || 0) + this.workOrderSummary.blocked_by_materials + (this.expenseAnomalySummary.critical || 0);
    const warnTotal = (this.lowStockSummary.high || 0) + (this.debtSummary.warning || 0) + (this.inactiveSummary.warning || 0) + (this.expenseAnomalySummary.warning || 0) + (this.priceVarianceSummary.overspend_items || 0);
    const normTotal = (this.lowStockSummary.medium || 0) + (this.debtSummary.mild || 0) + (this.inactiveSummary.at_risk || 0) + this.workOrderSummary.ready_to_produce;

    const isCircular = type === 'doughnut' || type === 'pie';

    if (isCircular) {
      this.overviewSeverityChart = new Chart(ctx, {
        type,
        data: {
          labels: ['Critical', 'Warning', 'Normal'],
          datasets: [{ data: [critTotal, warnTotal, normTotal], backgroundColor: ['#ff4d4f', '#faad14', '#52c41a'], borderColor: '#fff', borderWidth: 2 }]
        },
        options: {
          responsive: true, maintainAspectRatio: true, aspectRatio: 1,
          cutout: type === 'doughnut' ? '60%' : undefined,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10, usePointStyle: true } },
            title: { display: true, text: `Issues by Severity (${critTotal + warnTotal + normTotal} total)`, color: '#2c2e35', font: { size: 14, weight: 'bold' }, padding: { bottom: 4 } }
          }
        }
      });
    } else {
      this.overviewSeverityChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Critical', 'Warning', 'Normal'],
          datasets: [{ label: 'Issues', data: [critTotal, warnTotal, normTotal], backgroundColor: ['#ff4d4f', '#faad14', '#52c41a'], borderRadius: 6, barPercentage: 0.5 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          scales: { x: { grid: { display: false }, ticks: { font: { size: 12, weight: 'bold' }, color: '#2c2e35' } }, y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { stepSize: 1, font: { size: 11 }, color: '#555' } } },
          plugins: {
            legend: { display: false },
            title: { display: true, text: `Issues by Severity (${critTotal + warnTotal + normTotal} total)`, color: '#2c2e35', font: { size: 14, weight: 'bold' }, padding: { bottom: 4 } }
          }
        }
      });
    }
  }


  // ─── Material Data ───

  private _updateMaterialListCache() {
    const list: any[] = [];
    this.workOrderData.forEach((item: any) => {
      (item.materials || []).forEach((mat: any) => {
        list.push({ product: item.product_name, material: mat.product_name, required: mat.total_required, available: mat.available, shortage: mat.shortage || 0, sufficient: mat.is_sufficient });
      });
    });
    this.materialListCache = list;
  }

  // ─── Quickview Modal ───

  openQuickview(type: string) {
    this.quickviewType = type;
    this.quickviewTitle = this._getQuickviewTitle(type);
    this.quickviewStats = this._getQuickviewStats(type);
    this.quickviewDrillLabel = this._getQuickviewDrillLabel(type);
    this.quickviewOpen = true;
    this.scheduleTimer(() => this.initQuickviewChart(), 100);
  }

  closeQuickview() {
    this.quickviewOpen = false;
    if (this.quickviewChart) { this.quickviewChart.destroy(); this.quickviewChart = null; }
  }

  quickviewDrillDown() {
    const tabMap: any = { lowstock: 'inventory', debt: 'finance', inactive: 'sales', deadstock: 'inventory', workorders: 'production' };
    const tab = tabMap[this.quickviewType] || 'overview';
    this.closeQuickview();
    this.setActiveTab(tab);
  }

  initQuickviewChart() {
    if (!this.quickviewChartCanvas?.nativeElement) return;
    const ctx = this.quickviewChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.quickviewChart) this.quickviewChart.destroy();

    let config: any;
    switch (this.quickviewType) {
      case 'lowstock':
        config = {
          type: 'doughnut',
          data: {
            labels: ['Out of Stock', 'High Risk', 'Low Stock'],
            datasets: [{ data: [this.lowStockSummary.critical, this.lowStockSummary.high, this.lowStockSummary.medium], backgroundColor: ['#ff4d4f', '#faad14', '#1890ff'], borderWidth: 2, borderColor: '#fff' }]
          },
          options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12, usePointStyle: true } } } }
        };
        break;
      case 'debt':
        config = {
          type: 'doughnut',
          data: {
            labels: ['Critical (90+ days)', 'Warning (30-90)', 'Mild (<30)'],
            datasets: [{ data: [this.debtSummary.critical, this.debtSummary.warning, this.debtSummary.mild], backgroundColor: ['#ff4d4f', '#faad14', '#52c41a'], borderWidth: 2, borderColor: '#fff' }]
          },
          options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12, usePointStyle: true } } } }
        };
        break;
      case 'inactive':
        config = {
          type: 'doughnut',
          data: {
            labels: ['Lost (365+)', 'Critical (270+)', 'Warning (180+)', 'At Risk'],
            datasets: [{ data: [this.inactiveSummary.lost, this.inactiveSummary.critical, this.inactiveSummary.warning, this.inactiveSummary.at_risk], backgroundColor: ['#434343', '#ff4d4f', '#faad14', '#1890ff'], borderWidth: 2, borderColor: '#fff' }]
          },
          options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12, usePointStyle: true } } } }
        };
        break;
      case 'deadstock':
        const categories: any = {};
        this.deadStockData.forEach((item: any) => {
          const cat = item.category?.name || 'Uncategorized';
          categories[cat] = (categories[cat] || 0) + item.dead_stock_value;
        });
        const catLabels = Object.keys(categories).slice(0, 6);
        const catValues = catLabels.map(k => categories[k]);
        const catColors = ['#ff4d4f', '#faad14', '#1890ff', '#722ed1', '#13c2c2', '#52c41a'];
        config = {
          type: 'doughnut',
          data: {
            labels: catLabels,
            datasets: [{ data: catValues, backgroundColor: catColors.slice(0, catLabels.length), borderWidth: 2, borderColor: '#fff' }]
          },
          options: {
            responsive: true, maintainAspectRatio: true, aspectRatio: 1, cutout: '65%',
            plugins: {
              legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12, usePointStyle: true } },
              tooltip: { callbacks: { label: (c: any) => c.label + ': ' + this.formatCurrency(c.raw) } }
            }
          }
        };
        break;
      case 'workorders':
        config = {
          type: 'doughnut',
          data: {
            labels: ['Ready to Produce', 'Blocked by Materials'],
            datasets: [{ data: [this.workOrderSummary.ready_to_produce, this.workOrderSummary.blocked_by_materials], backgroundColor: ['#52c41a', '#ff4d4f'], borderWidth: 2, borderColor: '#fff' }]
          },
          options: { responsive: true, maintainAspectRatio: true, aspectRatio: 1, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 12, usePointStyle: true } } } }
        };
        break;
      default: return;
    }
    this.quickviewChart = new Chart(ctx, config);
  }

  private _getQuickviewTitle(type: string): string {
    const titles: any = { lowstock: 'Low Stock Breakdown', debt: 'Debt Risk Distribution', inactive: 'Customer Inactivity', deadstock: 'Dead Stock by Category', workorders: 'Work Order Status' };
    return titles[type] || '';
  }

  private _getQuickviewStats(type: string): any[] {
    switch (type) {
      case 'lowstock': return [
        { value: this.lowStockSummary.critical, label: 'Out of Stock', color: 'stat-critical' },
        { value: this.lowStockSummary.high, label: 'High Risk', color: 'stat-high' },
        { value: this.lowStockSummary.medium, label: 'Low Stock', color: 'stat-medium' }
      ];
      case 'debt': return [
        { value: this.formatCurrency(this.debtSummary.total_overdue_amount), label: 'Total Overdue', color: 'stat-critical' },
        { value: this.debtSummary.critical, label: 'Critical', color: 'stat-critical' },
        { value: this.debtSummary.warning, label: 'Warning', color: 'stat-high' },
        { value: this.debtSummary.mild, label: 'Mild', color: 'stat-medium' }
      ];
      case 'inactive': return [
        { value: this.inactiveSummary.lost, label: 'Lost', color: 'stat-dark' },
        { value: this.inactiveSummary.critical, label: 'Critical', color: 'stat-critical' },
        { value: this.inactiveSummary.warning, label: 'Warning', color: 'stat-high' },
        { value: this.inactiveSummary.at_risk, label: 'At Risk', color: 'stat-medium' }
      ];
      case 'deadstock': return [
        { value: this.deadStockSummary.total_dead_products, label: 'Products', color: 'stat-critical' },
        { value: this.formatCurrency(this.deadStockSummary.total_dead_stock_value), label: 'Value Blocked', color: 'stat-high' }
      ];
      case 'workorders': return [
        { value: this.workOrderSummary.total_suggestions, label: 'Total', color: 'stat-medium' },
        { value: this.workOrderSummary.ready_to_produce, label: 'Ready', color: 'stat-success' },
        { value: this.workOrderSummary.blocked_by_materials, label: 'Blocked', color: 'stat-critical' }
      ];
      default: return [];
    }
  }

  private _getQuickviewDrillLabel(type: string): string {
    const labels: any = { lowstock: 'View Inventory Details', debt: 'View Finance Details', inactive: 'View Customer Details', deadstock: 'View Inventory Details', workorders: 'View Production Details' };
    return labels[type] || 'View Details';
  }

  // ─── Toast ───

  showToast(message: string, type: string = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    this.scheduleTimer(() => { this.toastVisible = false; }, 4000);
  }

  // ─── Helpers ───

  formatCurrency(value: number): string {
    if (value == null || isNaN(value)) return '₹0';
    if (value >= 10000000) return '₹' + (value / 10000000).toFixed(2) + ' Cr';
    if (value >= 100000) return '₹' + (value / 100000).toFixed(2) + ' L';
    if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + ' K';
    return '₹' + value.toFixed(0);
  }

  // ─── AI Insight Generation ───

  updateInsights() {
    if (this.insightTimer) clearTimeout(this.insightTimer);
    this.insightTimer = setTimeout(() => this._runInsights(), 200);
  }

  private _runInsights() {
    this.allDataLoaded = !this.lowStockLoading && !this.forecastLoading && !this.debtLoading &&
      !this.inactiveLoading && !this.deadStockLoading && !this.bestVendorLoading &&
      !this.workOrderLoading && !this.purchaseOrderLoading && !this.demandForecastLoading &&
      !this.churnRiskLoading && !this.cashFlowLoading && !this.expenseAnomalyLoading &&
      !this.priceVarianceLoading && !this.rawMaterialLoading && !this.profitMarginLoading &&
      !this.moneyBleedingLoading && !this.seasonalityLoading && !this.whatIfLoading;
    this.overviewInsight = this._getOverviewInsight();
    this.financeInsight = this._getFinanceInsight();
    this.salesInsight = this._getSalesInsight();
    this.inventoryInsight = this._getInventoryInsight();
    this.purchaseInsight = this._getPurchaseInsight();
    this.productionInsight = this._getProductionInsight();
    this.priorityActions = this._getPriorityActions();
    this.smartAlerts = this.priorityActions.filter(a => a.severity === 'critical' || a.severity === 'warning');
    this._updateDepartmentHealth();
    this.rebuildCards();
    this._cacheTabCards();
    if (this.allDataLoaded) {
      this.cdr.detectChanges();
      this.scheduleTimer(() => this.initChartsForTab(this.activeTab), 150);
      this.scheduleTimer(() => this.initChartsForTab(this.activeTab), 600);
    }
  }

  private _getOverviewInsight(): string {
    const issues: string[] = [];
    if (this.lowStockSummary.critical > 0) issues.push(this.lowStockSummary.critical + ' products out of stock');
    if (this.debtSummary.critical > 0) issues.push(this.debtSummary.critical + ' critical payment defaults');
    if (this.inactiveSummary.lost + this.inactiveSummary.critical > 0)
      issues.push((this.inactiveSummary.lost + this.inactiveSummary.critical) + ' customers at high churn risk');
    if (this.deadStockSummary.total_dead_stock_value > 0)
      issues.push(this.formatCurrency(this.deadStockSummary.total_dead_stock_value) + ' capital blocked in dead stock');
    if (this.cashFlowSummary.risk_level === 'HIGH')
      issues.push('Cash flow risk detected — outflows may exceed inflows');
    if (this.expenseAnomalySummary.total_anomalies > 0)
      issues.push(this.expenseAnomalySummary.total_anomalies + ' expense anomalies worth ' + this.formatCurrency(this.expenseAnomalySummary.total_excess_amount));
    if (this.priceVarianceSummary.total_overspend > 0)
      issues.push(this.formatCurrency(this.priceVarianceSummary.total_overspend) + ' purchase overspend detected');
    if (this.rawMaterialSummary.critical_count > 0)
      issues.push(this.rawMaterialSummary.critical_count + ' raw material(s) critically low');
    if (this.profitMarginSummary.red_count > 0)
      issues.push(this.profitMarginSummary.red_count + ' product(s) with unhealthy profit margins');
    if (this.moneyBleedingSummary.total_bleeding > 0)
      issues.push(this.formatCurrency(this.moneyBleedingSummary.total_bleeding) + ' total money bleeding across ' + this.moneyBleedingSummary.modules_affected + ' modules');
    if (issues.length === 0) return 'All systems healthy. No critical issues detected.';
    return issues.length + ' area' + (issues.length > 1 ? 's' : '') + ' need attention: ' + issues.join(' \u00B7 ') + '.';
  }

  private _getFinanceInsight(): string {
    const parts: string[] = [];
    if (this.debtSummary.critical > 0)
      parts.push(this.debtSummary.critical + ' customer(s) have overdue payments beyond 90 days totaling ' + this.formatCurrency(this.debtSummary.total_overdue_amount) + '.');
    else if (this.debtSummary.warning > 0)
      parts.push(this.debtSummary.warning + ' customer(s) approaching critical overdue status.');
    if (this.cashFlowSummary.risk_level === 'HIGH')
      parts.push('Cash flow risk is HIGH — projected outflows exceed inflows.');
    else if (this.cashFlowSummary.net_flow > 0)
      parts.push('Net cash flow is positive at ' + this.formatCurrency(this.cashFlowSummary.net_flow) + '.');
    if (this.expenseAnomalySummary.total_anomalies > 0)
      parts.push(this.expenseAnomalySummary.total_anomalies + ' expense anomalies detected with ' + this.formatCurrency(this.expenseAnomalySummary.total_excess_amount) + ' excess spending.');
    if (this.profitMarginSummary.red_count > 0)
      parts.push(this.profitMarginSummary.red_count + ' product(s) with unhealthy margins. Overall margin: ' + (this.profitMarginSummary.overall_margin || 0).toFixed(1) + '%.');
    if (this.moneyBleedingSummary.total_bleeding > 0)
      parts.push(this.formatCurrency(this.moneyBleedingSummary.total_bleeding) + ' total money bleeding across ' + this.moneyBleedingSummary.modules_affected + ' module(s).');
    if (parts.length === 0) return 'All financial metrics are healthy. No overdue payments, stable cash flow.';
    return parts.join(' ');
  }

  private _getSalesInsight(): string {
    const parts: string[] = [];
    if (this.inactiveSummary.lost > 0)
      parts.push(this.inactiveSummary.lost + ' customer(s) have not purchased in over a year.');
    else if (this.inactiveSummary.critical > 0)
      parts.push(this.inactiveSummary.critical + ' customer(s) showing critical disengagement (270+ days).');
    const atRisk = this.churnRiskData.filter((c: any) => c.segment === 'AT_RISK' || c.segment === 'LOST').length;
    const champions = this.churnRiskData.filter((c: any) => c.segment === 'CHAMPION').length;
    if (atRisk > 0) parts.push(atRisk + ' customer(s) flagged as At Risk/Lost by RFM analysis.');
    if (champions > 0) parts.push(champions + ' champion customer(s) — nurture these relationships.');
    if (this.seasonalitySummary.busiest_month)
      parts.push('Busiest sales month: ' + this.seasonalitySummary.busiest_month + '. ' + this.seasonalitySummary.products_with_seasonal_peaks + ' product(s) show seasonal peaks.');
    if (parts.length === 0) return 'All customers actively engaged. No churn risk detected.';
    return parts.join(' ');
  }

  private _getInventoryInsight(): string {
    const val = this.deadStockSummary.total_dead_stock_value;
    const count = this.deadStockSummary.total_dead_products;
    if (val > 0) return this.formatCurrency(val) + ' capital locked in ' + count + ' product(s) with no movement for 90+ days. Consider clearance sales, bundling, or liquidation to free working capital.';
    return 'Inventory moving efficiently. No dead stock detected.';
  }

  private _getPurchaseInsight(): string {
    const parts: string[] = [];
    const count = this.purchaseOrderSummary.total_products_to_reorder;
    if (count > 0) parts.push(count + ' product(s) below minimum stock. Best vendors auto-selected.');
    if (this.priceVarianceSummary.total_overspend > 0)
      parts.push(this.formatCurrency(this.priceVarianceSummary.total_overspend) + ' potential savings identified from ' + this.priceVarianceSummary.overspend_items + ' overpriced purchases.');
    if (this.priceVarianceSummary.increasing_price_trends > 0)
      parts.push(this.priceVarianceSummary.increasing_price_trends + ' vendor(s) with increasing price trends — negotiate or switch.');
    if (parts.length === 0) return 'All products above minimum stock. No price overspend detected.';
    return parts.join(' ');
  }

  private _getProductionInsight(): string {
    const ready = this.workOrderSummary.ready_to_produce;
    const blocked = this.workOrderSummary.blocked_by_materials;
    const parts: string[] = [];
    if (ready > 0 && blocked > 0) parts.push(ready + ' product(s) ready for immediate production. ' + blocked + ' blocked due to raw material shortage.');
    else if (ready > 0) parts.push(ready + ' product(s) ready for production. All materials available.');
    else if (blocked > 0) parts.push(blocked + ' product(s) need manufacturing but raw materials are insufficient.');
    if (this.rawMaterialSummary.critical_count > 0)
      parts.push(this.rawMaterialSummary.critical_count + ' raw material(s) critically low — production may halt without procurement.');
    else if (this.rawMaterialSummary.warning_count > 0)
      parts.push(this.rawMaterialSummary.warning_count + ' raw material(s) in warning zone. Plan procurement.');
    if (!this.whatIfSummary.can_handle_growth)
      parts.push('What-If: At ' + this.whatIfSummary.growth_pct + '% growth, ' + this.whatIfSummary.materials_short + ' material(s) fall short — est. ₹' + this.formatCurrency(this.whatIfSummary.total_additional_cost).replace('₹','') + ' procurement needed.');
    if (parts.length === 0) return 'Production aligned with demand. No manufacturing suggestions.';
    return parts.join(' ');
  }

  getDebtRecommendation(item: any): string {
    if (item.risk_level === 'CRITICAL') return 'Escalate & restrict credit';
    if (item.risk_level === 'WARNING') return 'Send payment reminder';
    return 'Monitor payment';
  }

  getInactiveRecommendation(item: any): string {
    if (item.risk_level === 'LOST') return 'Win-back campaign';
    if (item.risk_level === 'CRITICAL') return 'Urgent outreach';
    if (item.risk_level === 'WARNING') return 'Schedule follow-up';
    return 'Monitor activity';
  }

  getDeadStockRecommendation(item: any): string {
    if (item.days_since_last_sale > 180 || !item.last_sold_date) return 'Liquidate or bundle';
    return 'Offer discount';
  }

  // ─── Priority Actions (Overview Command Center) ───

  private _getPriorityActions(): any[] {
    const actions: any[] = [];

    // Critical: Out of stock products
    if (this.lowStockSummary.critical > 0) {
      const names = this.lowStockData.filter((p: any) => p.severity === 'critical').map((p: any) => p.name).slice(0, 3);
      actions.push({
        severity: 'critical', icon: '🚨', tab: 'inventory',
        title: this.lowStockSummary.critical + ' product(s) out of stock',
        detail: names.join(', ') + (this.lowStockSummary.critical > 3 ? ' +more' : '') + ' — Customers cannot order these. Initiate emergency reorder.',
        action: 'Go to Purchase', actionTab: 'purchase'
      });
    }

    // Critical: Debt defaulters
    if (this.debtSummary.critical > 0) {
      const topDebt = this.debtData.find((d: any) => d.risk_level === 'CRITICAL');
      actions.push({
        severity: 'critical', icon: '💰', tab: 'finance',
        title: this.formatCurrency(this.debtSummary.total_overdue_amount) + ' overdue from ' + this.debtData.length + ' customer(s)',
        detail: (topDebt ? topDebt.customer_name + ' owes ' + this.formatCurrency(topDebt.total_overdue_amount) + ' for ' + topDebt.max_overdue_days + ' days. ' : '') + 'Restrict credit and escalate collection.',
        action: 'View Finance', actionTab: 'finance'
      });
    }

    // Warning: Stock running out soon
    const urgentForecast = this.forecastData.filter((p: any) => p.days_remaining <= 15 && p.days_remaining !== 999);
    if (urgentForecast.length > 0) {
      actions.push({
        severity: 'warning', icon: '⏳', tab: 'inventory',
        title: urgentForecast.length + ' product(s) will run out within 15 days',
        detail: urgentForecast.slice(0, 3).map((p: any) => p.name + ' (' + p.days_remaining + ' days)').join(', ') + '. Place reorder now to avoid stockout.',
        action: 'Go to Purchase', actionTab: 'purchase'
      });
    }

    // Warning: Dead stock capital
    if (this.deadStockSummary.total_dead_stock_value > 0) {
      actions.push({
        severity: 'warning', icon: '📦', tab: 'inventory',
        title: this.formatCurrency(this.deadStockSummary.total_dead_stock_value) + ' blocked in ' + this.deadStockSummary.total_dead_products + ' dead stock items',
        detail: 'No movement for 90+ days. Run clearance sale or bundle offers to free working capital.',
        action: 'View Inventory', actionTab: 'inventory'
      });
    }

    // Warning: Inactive customers
    if (this.inactiveSummary.lost + this.inactiveSummary.critical > 0) {
      const total = this.inactiveSummary.lost + this.inactiveSummary.critical;
      actions.push({
        severity: 'warning', icon: '👤', tab: 'sales',
        title: total + ' customer(s) at high churn risk',
        detail: (this.inactiveSummary.lost > 0 ? this.inactiveSummary.lost + ' lost (365+ days). ' : '') + (this.inactiveSummary.critical > 0 ? this.inactiveSummary.critical + ' critical (270+ days). ' : '') + 'Launch re-engagement campaign.',
        action: 'View Sales', actionTab: 'sales'
      });
    } else if (this.inactiveData.length > 0) {
      actions.push({
        severity: 'info', icon: '👤', tab: 'sales',
        title: this.inactiveData.length + ' customer(s) showing reduced activity',
        detail: 'All in warning/at-risk zone. Monitor and consider targeted promotions before they disengage.',
        action: 'View Sales', actionTab: 'sales'
      });
    }

    // Info: Work orders ready
    if (this.workOrderSummary.ready_to_produce > 0) {
      actions.push({
        severity: 'success', icon: '🏭', tab: 'production',
        title: this.workOrderSummary.ready_to_produce + ' product(s) ready for production',
        detail: 'All raw materials available. Create work orders to replenish finished goods stock.',
        action: 'Go to Production', actionTab: 'production'
      });
    } else if (this.workOrderSummary.blocked_by_materials > 0) {
      actions.push({
        severity: 'warning', icon: '🏭', tab: 'production',
        title: this.workOrderSummary.blocked_by_materials + ' product(s) need manufacturing but materials insufficient',
        detail: 'Procure raw materials first, then create work orders.',
        action: 'View Production', actionTab: 'production'
      });
    }

    // Info: Purchase suggestions ready
    if (this.purchaseOrderSummary.total_products_to_reorder > 0) {
      actions.push({
        severity: 'info', icon: '🛒', tab: 'purchase',
        title: this.purchaseOrderSummary.total_products_to_reorder + ' auto-purchase order(s) ready',
        detail: 'Best vendors pre-selected. Estimated cost: ' + this.formatCurrency(this.purchaseOrderSummary.total_estimated_cost) + '. One-click PO generation available.',
        action: 'Create POs', actionTab: 'purchase'
      });
    }

    // Critical/Warning: Cash flow risk
    if (this.cashFlowSummary.risk_level === 'HIGH') {
      actions.push({
        severity: 'critical', icon: '💸', tab: 'finance',
        title: 'Cash flow risk HIGH — outflows may exceed inflows',
        detail: 'Net flow: ' + this.formatCurrency(this.cashFlowSummary.net_flow) + '. Review upcoming expenses and accelerate receivables.',
        action: 'View Cash Flow', actionTab: 'finance'
      });
    } else if (this.cashFlowSummary.risk_level === 'MEDIUM') {
      actions.push({
        severity: 'warning', icon: '💸', tab: 'finance',
        title: 'Cash flow risk MEDIUM — monitor closely',
        detail: 'Net flow: ' + this.formatCurrency(this.cashFlowSummary.net_flow) + '. Margins are thin — avoid large unplanned expenses.',
        action: 'View Cash Flow', actionTab: 'finance'
      });
    }

    // Warning: Expense anomalies
    if (this.expenseAnomalySummary.total_anomalies > 0) {
      actions.push({
        severity: this.expenseAnomalySummary.critical > 0 ? 'critical' : 'warning', icon: '⚠️', tab: 'finance',
        title: this.expenseAnomalySummary.total_anomalies + ' expense anomaly(s) — ' + this.formatCurrency(this.expenseAnomalySummary.total_excess_amount) + ' excess',
        detail: this.expenseAnomalySummary.categories_affected + ' category(s) affected. ' + (this.expenseAnomalySummary.critical || 0) + ' critical, ' + (this.expenseAnomalySummary.warning || 0) + ' warning.',
        action: 'View Anomalies', actionTab: 'finance'
      });
    }

    // Warning: Price overspend
    if (this.priceVarianceSummary.total_overspend > 0) {
      actions.push({
        severity: 'warning', icon: '📊', tab: 'purchase',
        title: this.formatCurrency(this.priceVarianceSummary.total_overspend) + ' purchase overspend detected',
        detail: this.priceVarianceSummary.overspend_items + ' product(s) bought above best available rate. Switch vendors to save.',
        action: 'View Prices', actionTab: 'purchase'
      });
    }
    if (this.priceVarianceSummary.increasing_price_trends > 0) {
      actions.push({
        severity: 'info', icon: '📈', tab: 'purchase',
        title: this.priceVarianceSummary.increasing_price_trends + ' vendor(s) with rising prices',
        detail: 'Price trends increasing. Negotiate better rates or explore alternative vendors.',
        action: 'View Prices', actionTab: 'purchase'
      });
    }

    // Critical: Raw materials critically low
    if (this.rawMaterialSummary.critical_count > 0) {
      actions.push({
        severity: 'critical', icon: '🧪', tab: 'production',
        title: this.rawMaterialSummary.critical_count + ' raw material(s) critically low',
        detail: 'Less than 15 days of stock remaining. Procure immediately to avoid production halt.',
        action: 'View Production', actionTab: 'production'
      });
    } else if (this.rawMaterialSummary.warning_count > 0) {
      actions.push({
        severity: 'warning', icon: '🧪', tab: 'production',
        title: this.rawMaterialSummary.warning_count + ' raw material(s) in warning zone',
        detail: 'Stock running low. Plan procurement to maintain safety stock.',
        action: 'View Production', actionTab: 'production'
      });
    }

    // Critical: Unhealthy profit margins
    if (this.profitMarginSummary.red_count > 0) {
      actions.push({
        severity: 'critical', icon: '💹', tab: 'finance',
        title: this.profitMarginSummary.red_count + ' product(s) with unhealthy margins (< 10%)',
        detail: 'Overall margin: ' + (this.profitMarginSummary.overall_margin || 0).toFixed(1) + '%. Review pricing strategy or reduce costs.',
        action: 'View Margins', actionTab: 'finance'
      });
    }

    // Critical/Warning: Money bleeding
    if (this.moneyBleedingSummary.critical_count > 0) {
      actions.push({
        severity: 'critical', icon: '🩸', tab: 'finance',
        title: this.formatCurrency(this.moneyBleedingSummary.total_bleeding) + ' money bleeding — ' + this.moneyBleedingSummary.critical_count + ' critical',
        detail: this.moneyBleedingSummary.modules_affected + ' modules affected. Investigate and plug the leaks immediately.',
        action: 'View Bleeding', actionTab: 'finance'
      });
    } else if (this.moneyBleedingSummary.total_bleeding > 0) {
      actions.push({
        severity: 'warning', icon: '🩸', tab: 'finance',
        title: this.formatCurrency(this.moneyBleedingSummary.total_bleeding) + ' total money bleeding',
        detail: this.moneyBleedingSummary.total_categories + ' categories across ' + this.moneyBleedingSummary.modules_affected + ' modules. Review and optimize.',
        action: 'View Bleeding', actionTab: 'finance'
      });
    }

    // Warning: Demand declining
    if (this.demandForecastSummary.trending_down > 0) {
      actions.push({
        severity: 'warning', icon: '📉', tab: 'inventory',
        title: this.demandForecastSummary.trending_down + ' product(s) with declining demand',
        detail: 'Demand trending down. Reduce reorder quantities to avoid overstocking.',
        action: 'View Forecast', actionTab: 'inventory'
      });
    }

    // Warning: Churn risk customers
    const churnAtRisk = (this.churnRiskSummary.at_risk || 0) + (this.churnRiskSummary.lost || 0);
    if (churnAtRisk > 0) {
      actions.push({
        severity: 'warning', icon: '🔄', tab: 'sales',
        title: churnAtRisk + ' customer(s) at churn risk (RFM Analysis)',
        detail: (this.churnRiskSummary.lost || 0) + ' lost, ' + (this.churnRiskSummary.at_risk || 0) + ' at risk. Run personalized re-engagement campaigns.',
        action: 'View Segments', actionTab: 'sales'
      });
    }

    // What-If: Cannot handle growth
    if (!this.whatIfSummary.can_handle_growth && this.whatIfSummary.materials_short > 0) {
      actions.push({
        severity: this.whatIfSummary.materials_short >= 3 ? 'critical' : 'warning', icon: '🔮', tab: 'production',
        title: 'What-If: ' + this.whatIfSummary.materials_short + ' material(s) short at ' + this.whatIfSummary.growth_pct + '% growth',
        detail: 'Simulated ' + this.whatIfSummary.forecast_months + '-month forecast shows ₹' + this.formatCurrency(this.whatIfSummary.total_additional_cost).replace('₹','') + ' additional procurement needed.',
        action: 'View Simulation', actionTab: 'production'
      });
    }

    return actions;
  }

  // ─── Department Health Status ───

  private _updateDepartmentHealth() {
    const invC = this.lowStockSummary.critical + this.forecastRedCount;
    const invW = (this.lowStockSummary.high || 0) + (this.forecastYellowCount || 0) + (this.deadStockSummary.total_dead_products || 0);
    const finC = (this.debtSummary.critical || 0) + (this.expenseAnomalySummary.critical || 0) + (this.cashFlowSummary.risk_level === 'HIGH' ? 1 : 0) + (this.profitMarginSummary.red_count || 0) + (this.moneyBleedingSummary.critical_count || 0);
    const finW = (this.debtSummary.warning || 0) + (this.expenseAnomalySummary.warning || 0) + (this.cashFlowSummary.risk_level === 'MEDIUM' ? 1 : 0) + (this.profitMarginSummary.yellow_count || 0) + (this.moneyBleedingSummary.high_count || 0);
    const salC = (this.inactiveSummary.lost || 0) + (this.inactiveSummary.critical || 0);
    const salW = (this.inactiveSummary.warning || 0) + (this.churnRiskSummary.at_risk || 0);
    const purC = 0;
    const purW = (this.priceVarianceSummary.overspend_items || 0) + (this.priceVarianceSummary.increasing_price_trends || 0);
    const proC = (this.workOrderSummary.blocked_by_materials || 0) + (this.rawMaterialSummary.critical_count || 0);
    const proW = (this.rawMaterialSummary.warning_count || 0) + (this.whatIfSummary.materials_short || 0);

    const updated = [
      { name: 'Inventory', tab: 'inventory', alertCount: invC + invW, status: invC > 0 ? 'critical' : invW > 0 ? 'warning' : 'success' },
      { name: 'Finance', tab: 'finance', alertCount: finC + finW, status: finC > 0 ? 'critical' : finW > 0 ? 'warning' : 'success' },
      { name: 'Sales', tab: 'sales', alertCount: salC + salW, status: salC > 0 ? 'critical' : salW > 0 ? 'warning' : 'success' },
      { name: 'Purchase', tab: 'purchase', alertCount: purC + purW, status: purC > 0 ? 'critical' : purW > 0 ? 'warning' : 'success' },
      { name: 'Production', tab: 'production', alertCount: proC + proW, status: proC > 0 ? 'critical' : proW > 0 ? 'warning' : 'success' }
    ];
    if (this.departmentHealth.length === updated.length) {
      updated.forEach((u, i) => {
        this.departmentHealth[i].alertCount = u.alertCount;
        this.departmentHealth[i].status = u.status;
      });
    } else {
      this.departmentHealth = updated;
    }
  }

  // ═══════════════════════════════════════════════════
  // Smart Dashboard — Severity Card System
  // ═══════════════════════════════════════════════════

  trackCardById(index: number, card: InsightCard): string {
    return card.id;
  }

  rebuildCards() {
    const all: InsightCard[] = [
      this._buildLowStockCard(),
      this._buildStockForecastCard(),
      this._buildDebtCard(),
      this._buildInactiveCard(),
      this._buildDeadStockCard(),
      this._buildBestVendorCard(),
      this._buildWorkOrderCard(),
      this._buildAutoPOCard(),
      this._buildDemandForecastCard(),
      this._buildChurnRiskCard(),
      this._buildCashFlowCard(),
      this._buildExpenseAnomalyCard(),
      this._buildPriceVarianceCard(),
      this._buildRawMaterialCard(),
      this._buildProfitMarginCard(),
      this._buildMoneyBleedingCard(),
      this._buildSeasonalityCard(),
      this._buildWhatIfCard()
    ].filter(c => !this.hiddenCards.includes(c.id));

    this.insightCards = all;
    this.criticalCards = all.filter(c => !c.loading && c.severity === 'critical');
    this.warningCards = all.filter(c => !c.loading && c.severity === 'warning');
    this.healthyCards = all.filter(c => c.loading || c.severity === 'healthy');
  }

  refreshWidget(id: string) {
    const map: { [k: string]: () => void } = {
      'low-stock': () => this.fetchLowStock(),
      'stock-forecast': () => this.fetchStockForecast(),
      'debt-defaulters': () => this.fetchDebtDefaulters(),
      'inactive-customers': () => this.fetchInactiveCustomers(),
      'dead-stock': () => this.fetchDeadStock(),
      'best-vendor': () => this.fetchBestVendors(),
      'work-orders': () => this.fetchWorkOrderSuggestions(),
      'auto-po': () => this.fetchPurchaseOrderSuggestions(),
      'demand-forecast': () => this.fetchDemandForecast(),
      'churn-risk': () => this.fetchChurnRisk(),
      'cash-flow': () => this.fetchCashFlowForecast(),
      'expense-anomaly': () => this.fetchExpenseAnomalies(),
      'price-variance': () => this.fetchPriceVariance(),
      'raw-material': () => this.fetchRawMaterialForecast(),
      'profit-margin': () => this.fetchProfitMargin(),
      'money-bleeding': () => this.fetchMoneyBleeding(),
      'seasonality': () => this.fetchSeasonality(),
      'what-if': () => this.fetchWhatIf()
    };
    if (map[id]) map[id]();
  }

  hideWidget(id: string) {
    this.hiddenCards.push(id);
    this.rebuildCards();
    this.showToast('Widget hidden. Refresh page to restore.', 'success');
  }

  changeCardChartType(id: string, type: ChartType) {
    this.cardChartTypes[id] = type;
    this.rebuildCards();
  }

  toggleViewMode(id: string) {
    const cur = this.cardViewModes[id] || 'chart';
    this.cardViewModes[id] = cur === 'chart' ? 'table' : 'chart';
    this.rebuildCards();
  }

  refreshAllWidgets() {
    this.fetchAllData();
    this.showToast('Refreshing all data...', 'success');
  }

  // ─── Customization Drawer ───

  private _initWidgetRegistry() {
    this.dashboardWidgets = [];
    this.tabConfigs.forEach(tab => {
      this.dashboardWidgets.push(
        { id: `${tab.key}-cards`, label: 'Summary Cards', tab: tab.key, type: 'card', visible: true },
        { id: `${tab.key}-insight`, label: 'AI Insight Banner', tab: tab.key, type: 'card', visible: true }
      );
      tab.reports.forEach(r => {
        this.dashboardWidgets.push({ id: r.widgetId, label: r.drawerLabel, tab: tab.key, type: 'report', visible: true });
      });
      (tab.extraSections || []).forEach(s => {
        this.dashboardWidgets.push({ id: s.widgetId, label: s.drawerLabel, tab: tab.key, type: 'table', visible: true });
      });
    });
  }

  toggleCustomDrawer() {
    this.customDrawerOpen = !this.customDrawerOpen;
  }

  isWidgetVisible(widgetId: string): boolean {
    return this.widgetVisibility[widgetId] !== false;
  }

  private _rebuildVisibilityCache() {
    this.widgetVisibility = {};
    this.dashboardWidgets.forEach(w => {
      this.widgetVisibility[w.id] = w.visible;
    });
  }

  toggleWidget(widgetId: string) {
    const w = this.dashboardWidgets.find(x => x.id === widgetId);
    if (w) {
      w.visible = !w.visible;
      this._savePreferences();
      this._rebuildVisibilityCache();
      // Re-init charts for current tab if re-enabling a report
      if (w.visible && w.tab === this.activeTab) {
        this.cdr.detectChanges();
        this.scheduleTimer(() => this.initChartsForTab(this.activeTab), 150);
      }
    }
  }

  getWidgetsForTab(tab: string): DashboardWidget[] {
    return this.dashboardWidgets.filter(w => w.tab === tab);
  }

  resetPreferences() {
    this.dashboardWidgets.forEach(w => w.visible = true);
    this._savePreferences();
    this._rebuildVisibilityCache();
    this.showToast('Dashboard reset to default layout', 'success');
    this.cdr.detectChanges();
    this.scheduleTimer(() => this.initChartsForTab(this.activeTab), 150);
  }

  private _loadPreferences() {
    try {
      const raw = localStorage.getItem(this.PREFS_KEY);
      if (raw) {
        const prefs: DashboardPreferences = JSON.parse(raw);
        if (prefs.hiddenWidgets?.length) {
          this.dashboardWidgets.forEach(w => {
            w.visible = !prefs.hiddenWidgets.includes(w.id);
          });
        }
        if (prefs.chartDefaults) {
          Object.entries(prefs.chartDefaults).forEach(([k, v]) => {
            this.cardChartTypes[k] = v as ChartType;
          });
        }
      }
    } catch (_) { /* ignore corrupt storage */ }
    this._rebuildVisibilityCache();
  }

  private _savePreferences() {
    const prefs: DashboardPreferences = {
      hiddenWidgets: this.dashboardWidgets.filter(w => !w.visible).map(w => w.id),
      chartDefaults: this.cardChartTypes
    };
    try {
      localStorage.setItem(this.PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error('Failed to save dashboard preferences:', e);
    }
  }

  // ─── Card Builders ───

  private _buildLowStockCard(): InsightCard {
    const s = this.lowStockSummary;
    const sev: 'critical'|'warning'|'healthy' = this.lowStockLoading ? 'healthy' : s.critical > 0 ? 'critical' : s.high > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['low-stock'] || 'doughnut';
    return {
      id: 'low-stock', title: 'Low Stock Alerts', icon: '📦', severity: sev, loading: this.lowStockLoading,
      metrics: [
        { value: this.lowStockCount, label: 'Products', color: sev === 'critical' ? '#ff4d4f' : '#faad14' },
        { value: s.critical, label: 'Out of Stock', color: '#ff4d4f' },
        { value: s.high, label: 'High Risk', color: '#faad14' }
      ],
      insight: s.critical > 0 ? s.critical + ' product(s) completely out of stock. ' + s.high + ' more at high risk. Reorder immediately.'
        : this.lowStockCount > 0 ? this.lowStockCount + ' products below minimum stock. No critical shortages.' : 'All products above safe stock levels.',
      chartConfig: { chartType: ct, labels: ['Out of Stock', 'High Risk', 'Low Stock'],
        datasets: [{ label: 'Stock', data: [s.critical, s.high, s.medium], backgroundColor: ['#ff4d4f', '#faad14', '#1890ff'], borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: { columns: [
        { key: 'name', label: 'Product' }, { key: 'balance', label: 'Stock', type: 'number' },
        { key: 'minimum_level', label: 'Min Level', type: 'number' },
        { key: 'reorder_qty', label: 'Reorder Qty', type: 'number' },
        { key: 'severity', label: 'Status', type: 'badge', badgeMap: { critical: 'badge-red', high: 'badge-yellow', medium: 'badge-blue' } }
      ], data: this.lowStockData, emptyText: 'No low stock items', maxHeight: '200px', exportable: true, exportFilename: 'low-stock' },
      chartType: ct, viewMode: (this.cardViewModes['low-stock'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildStockForecastCard(): InsightCard {
    const sev: 'critical'|'warning'|'healthy' = this.forecastLoading ? 'healthy' : this.forecastRedCount > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['stock-forecast'] || 'bar';
    const top5 = this.forecastData.filter((p: any) => p.days_remaining !== 999).slice(0, 5);
    return {
      id: 'stock-forecast', title: 'Stock Forecast', icon: '📈', severity: sev, loading: this.forecastLoading,
      metrics: [
        { value: this.forecastRedCount, label: 'Critical', color: '#ff4d4f' },
        { value: this.forecastYellowCount, label: 'Warning', color: '#faad14' },
        { value: this.forecastCriticalProduct || '—', label: 'Most Urgent' }
      ],
      insight: this.forecastRedCount > 0
        ? this.forecastRedCount + ' product(s) will run out within 7 days. ' + this.forecastCriticalProduct + ' is most urgent (' + this.forecastCriticalDays + ' days).'
        : this.forecastData.length > 0 ? this.forecastData.length + ' products analyzed. No immediate stockout risk.' : 'No forecast data available.',
      chartConfig: { chartType: ct, labels: top5.map((p: any) => p.name?.substring(0, 20) || ''),
        datasets: [{ label: 'Days Left', data: top5.map((p: any) => p.days_remaining),
          backgroundColor: top5.map((p: any) => p.status === 'RED' ? '#ff4d4f' : '#faad14'), borderRadius: 4 }], horizontal: true, height: 200 },
      tableConfig: { columns: [
        { key: 'name', label: 'Product' }, { key: 'current_stock', label: 'Stock', type: 'number' },
        { key: 'days_remaining', label: 'Days Left', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge', badgeMap: { RED: 'badge-red', YELLOW: 'badge-yellow', GREEN: 'badge-green' } }
      ], data: this.forecastData, emptyText: 'No forecast data', maxHeight: '200px', exportable: true, exportFilename: 'stock-forecast' },
      chartType: ct, viewMode: (this.cardViewModes['stock-forecast'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildDebtCard(): InsightCard {
    const s = this.debtSummary;
    const sev: 'critical'|'warning'|'healthy' = this.debtLoading ? 'healthy' : s.critical > 0 ? 'critical' : s.warning > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['debt-defaulters'] || 'doughnut';
    return {
      id: 'debt-defaulters', title: 'Debt Defaulters', icon: '💰', severity: sev, loading: this.debtLoading,
      metrics: [
        { value: this.formatCurrency(s.total_overdue_amount), label: 'Total Overdue', color: '#ff4d4f' },
        { value: s.critical, label: 'Critical', color: '#ff4d4f' },
        { value: s.warning, label: 'Warning', color: '#faad14' }
      ],
      insight: s.critical > 0
        ? this.formatCurrency(s.total_overdue_amount) + ' overdue. ' + s.critical + ' customer(s) past 90 days. Escalate collection.'
        : this.debtData.length > 0 ? this.debtData.length + ' customer(s) with pending payments. All within acceptable window.' : 'No overdue payments. All receivables current.',
      chartConfig: { chartType: ct, labels: ['Critical', 'Warning', 'Mild'],
        datasets: [{ label: 'Debt', data: [s.critical, s.warning, s.mild], backgroundColor: ['#ff4d4f', '#faad14', '#52c41a'], borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: { columns: [
        { key: 'customer_name', label: 'Customer' },
        { key: 'total_overdue_amount', label: 'Overdue', type: 'currency' },
        { key: 'overdue_invoices_count', label: 'Invoices', type: 'number' },
        { key: 'max_overdue_days', label: 'Days', type: 'number' },
        { key: 'risk_level', label: 'Risk', type: 'badge', badgeMap: { CRITICAL: 'badge-red', WARNING: 'badge-yellow', MILD: 'badge-green' } }
      ], data: this.debtData, emptyText: 'No defaulters', maxHeight: '200px', exportable: true, exportFilename: 'debt-defaulters' },
      chartType: ct, viewMode: (this.cardViewModes['debt-defaulters'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildInactiveCard(): InsightCard {
    const s = this.inactiveSummary;
    const sev: 'critical'|'warning'|'healthy' = this.inactiveLoading ? 'healthy' : s.lost > 0 ? 'critical' : (s.critical + s.warning) > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['inactive-customers'] || 'doughnut';
    return {
      id: 'inactive-customers', title: 'Inactive Customers', icon: '👤', severity: sev, loading: this.inactiveLoading,
      metrics: [
        { value: this.inactiveData.length, label: 'Inactive', color: '#faad14' },
        { value: s.lost, label: 'Lost', color: '#434343' },
        { value: s.critical, label: 'Critical', color: '#ff4d4f' }
      ],
      insight: s.lost > 0
        ? s.lost + ' customer(s) have not purchased in over a year. ' + s.critical + ' critical. Launch re-engagement campaign.'
        : this.inactiveData.length > 0 ? this.inactiveData.length + ' customers showing reduced activity. Monitor engagement.' : 'All customers actively engaged.',
      chartConfig: { chartType: ct, labels: ['Lost', 'Critical', 'Warning', 'At Risk'],
        datasets: [{ label: 'Customers', data: [s.lost, s.critical, s.warning, s.at_risk], backgroundColor: ['#434343', '#ff4d4f', '#faad14', '#1890ff'], borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: { columns: [
        { key: 'customer_name', label: 'Customer' },
        { key: 'days_inactive', label: 'Days Inactive', type: 'number' },
        { key: 'total_invoices', label: 'Orders', type: 'number' },
        { key: 'risk_level', label: 'Risk', type: 'badge', badgeMap: { LOST: 'badge-dark', CRITICAL: 'badge-red', WARNING: 'badge-yellow', AT_RISK: 'badge-blue' } }
      ], data: this.inactiveData, emptyText: 'No inactive customers', maxHeight: '200px', exportable: true, exportFilename: 'inactive-customers' },
      chartType: ct, viewMode: (this.cardViewModes['inactive-customers'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildDeadStockCard(): InsightCard {
    const s = this.deadStockSummary;
    const sev: 'critical'|'warning'|'healthy' = this.deadStockLoading ? 'healthy' : s.total_dead_stock_value > 0 ? 'warning' : 'healthy';
    return {
      id: 'dead-stock', title: 'Dead Stock', icon: '🗑️', severity: sev, loading: this.deadStockLoading,
      metrics: [
        { value: s.total_dead_products, label: 'Products', color: '#faad14' },
        { value: this.formatCurrency(s.total_dead_stock_value), label: 'Value Blocked', color: '#ff4d4f' }
      ],
      insight: s.total_dead_stock_value > 0
        ? this.formatCurrency(s.total_dead_stock_value) + ' capital locked in ' + s.total_dead_products + ' product(s) with no movement for 90+ days. Consider clearance sales.'
        : 'No dead stock detected. Inventory moving efficiently.',
      chartConfig: null,
      tableConfig: { columns: [
        { key: 'product_name', label: 'Product' },
        { key: 'balance', label: 'Qty', type: 'number' },
        { key: 'dead_stock_value', label: 'Value', type: 'currency' },
        { key: 'days_since_last_sale', label: 'Days Idle', type: 'number' }
      ], data: this.deadStockData, emptyText: 'No dead stock', maxHeight: '200px', exportable: true, exportFilename: 'dead-stock' },
      chartType: 'bar', viewMode: 'table', hasChart: false, hasTable: true, lastUpdated: null
    };
  }

  private _buildBestVendorCard(): InsightCard {
    const s = this.bestVendorSummary;
    return {
      id: 'best-vendor', title: 'Best Vendors', icon: '🏆', severity: 'healthy', loading: this.bestVendorLoading,
      metrics: [
        { value: s.total_products_analyzed, label: 'Products', color: '#1890ff' },
        { value: s.total_vendors_scored, label: 'Vendors Scored', color: '#52c41a' }
      ],
      insight: s.total_products_analyzed > 0
        ? s.total_products_analyzed + ' products analyzed across ' + s.total_vendors_scored + ' vendors. Best vendors auto-selected for purchase orders.'
        : 'No vendor data available.',
      chartConfig: null,
      tableConfig: { columns: [
        { key: 'product_name', label: 'Product' },
        { key: 'best_vendor', label: 'Best Vendor' },
        { key: 'avg_rate', label: 'Avg Rate', type: 'currency' },
        { key: 'best_score', label: 'Score', type: 'number' }
      ], data: this.bestVendorData.map((item: any) => {
        const bv = this.getBestVendor(item);
        return { product_name: item.product_name, best_vendor: bv.vendor_name || '—', avg_rate: bv.avg_rate || 0, best_score: bv.total_score ? Math.round(bv.total_score) + '%' : '—' };
      }), emptyText: 'No vendor data', maxHeight: '200px', exportable: true, exportFilename: 'best-vendors' },
      chartType: 'bar', viewMode: 'table', hasChart: false, hasTable: true, lastUpdated: null
    };
  }

  private _buildWorkOrderCard(): InsightCard {
    const s = this.workOrderSummary;
    const sev: 'critical'|'warning'|'healthy' = this.workOrderLoading ? 'healthy' : s.blocked_by_materials > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['work-orders'] || 'doughnut';
    return {
      id: 'work-orders', title: 'Work Orders', icon: '🏭', severity: sev, loading: this.workOrderLoading,
      metrics: [
        { value: s.total_suggestions, label: 'Total', color: '#1890ff' },
        { value: s.ready_to_produce, label: 'Ready', color: '#52c41a' },
        { value: s.blocked_by_materials, label: 'Blocked', color: '#ff4d4f' }
      ],
      insight: s.ready_to_produce > 0 && s.blocked_by_materials > 0
        ? s.ready_to_produce + ' product(s) ready for production. ' + s.blocked_by_materials + ' blocked due to material shortage.'
        : s.ready_to_produce > 0 ? s.ready_to_produce + ' product(s) ready. All materials available. Create work orders to replenish stock.'
        : s.blocked_by_materials > 0 ? s.blocked_by_materials + ' product(s) need manufacturing but raw materials insufficient.'
        : 'Production aligned with demand. No manufacturing suggestions.',
      chartConfig: { chartType: ct, labels: ['Ready', 'Blocked'],
        datasets: [{ label: 'Work Orders', data: [s.ready_to_produce, s.blocked_by_materials], backgroundColor: ['#52c41a', '#ff4d4f'], borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: null,
      chartType: ct, viewMode: (this.cardViewModes['work-orders'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildAutoPOCard(): InsightCard {
    const s = this.purchaseOrderSummary;
    const sev: 'critical'|'warning'|'healthy' = this.purchaseOrderLoading ? 'healthy' : s.total_products_to_reorder > 0 ? 'warning' : 'healthy';
    return {
      id: 'auto-po', title: 'Auto Purchase Orders', icon: '🛒', severity: sev, loading: this.purchaseOrderLoading,
      metrics: [
        { value: s.total_products_to_reorder, label: 'To Reorder', color: '#faad14' },
        { value: this.formatCurrency(s.total_estimated_cost), label: 'Est. Cost', color: '#1890ff' }
      ],
      insight: s.total_products_to_reorder > 0
        ? s.total_products_to_reorder + ' product(s) below minimum stock. Best vendors pre-selected. Estimated cost: ' + this.formatCurrency(s.total_estimated_cost) + '.'
        : 'All products above minimum stock levels. No purchase orders needed.',
      chartConfig: null,
      tableConfig: null,
      chartType: 'bar', viewMode: 'table', hasChart: false, hasTable: true, lastUpdated: null
    };
  }

  private _buildDemandForecastCard(): InsightCard {
    const s = this.demandForecastSummary;
    const sev: 'critical'|'warning'|'healthy' = this.demandForecastLoading ? 'healthy' : s.trending_down > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['demand-forecast'] || 'bar';
    const stable = Math.max(0, (s.total_analyzed || 0) - (s.trending_up || 0) - (s.trending_down || 0));
    return {
      id: 'demand-forecast', title: 'Demand Forecast', icon: '📊', severity: sev, loading: this.demandForecastLoading,
      metrics: [
        { value: s.total_analyzed, label: 'Analyzed', color: '#1890ff' },
        { value: s.trending_up, label: 'Trending Up', color: '#52c41a' },
        { value: s.trending_down, label: 'Trending Down', color: '#ff4d4f' }
      ],
      insight: s.trending_down > 0
        ? s.trending_down + ' product(s) with declining demand. Reduce reorder quantities to avoid overstocking.'
        : s.total_analyzed > 0 ? s.total_analyzed + ' products analyzed. Demand is stable or growing.' : 'No demand data available.',
      chartConfig: { chartType: ct, labels: ['Trending Up', 'Trending Down', 'Stable'],
        datasets: [{ label: 'Products', data: [s.trending_up || 0, s.trending_down || 0, stable], backgroundColor: ['#52c41a', '#ff4d4f', '#1890ff'], borderRadius: 4 }], height: 200 },
      tableConfig: { columns: [
        { key: 'name', label: 'Product' },
        { key: 'current_stock', label: 'Current Stock', type: 'number' },
        { key: 'avg_monthly_sales', label: 'Avg Sales', type: 'number' },
        { key: 'risk', label: 'Action', type: 'badge', badgeMap: { HIGH: 'badge-red', MEDIUM: 'badge-yellow', LOW: 'badge-green' } }
      ], data: this.demandForecastData, emptyText: 'No forecast data', maxHeight: '200px', exportable: true, exportFilename: 'demand-forecast' },
      chartType: ct, viewMode: (this.cardViewModes['demand-forecast'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildChurnRiskCard(): InsightCard {
    const s = this.churnRiskSummary;
    const atRisk = (s.at_risk || 0) + (s.lost || 0);
    const sev: 'critical'|'warning'|'healthy' = this.churnRiskLoading ? 'healthy' : atRisk > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['churn-risk'] || 'doughnut';

    const segments: any = {};
    this.churnRiskData.forEach((c: any) => { segments[c.segment] = (segments[c.segment] || 0) + 1; });
    const segOrder = ['CHAMPION', 'LOYAL', 'NEW', 'NEEDS_ATTENTION', 'AT_RISK', 'LOST'];
    const segColors: any = { CHAMPION: '#52c41a', LOYAL: '#1890ff', NEW: '#13c2c2', NEEDS_ATTENTION: '#faad14', AT_RISK: '#ff7a45', LOST: '#434343' };
    const segLabels = segOrder.filter(sg => segments[sg]);

    return {
      id: 'churn-risk', title: 'Churn Risk (RFM)', icon: '🔄', severity: sev, loading: this.churnRiskLoading,
      metrics: [
        { value: s.total_customers, label: 'Customers', color: '#1890ff' },
        { value: s.champions, label: 'Champions', color: '#52c41a' },
        { value: atRisk, label: 'At Risk', color: '#ff4d4f' }
      ],
      insight: atRisk > 0
        ? atRisk + ' customer(s) at churn risk. ' + (s.lost || 0) + ' lost, ' + (s.at_risk || 0) + ' at risk. Run personalized re-engagement campaigns.'
        : s.total_customers > 0 ? s.total_customers + ' customers analyzed. No significant churn risk detected.' : 'No customer data available.',
      chartConfig: { chartType: ct, labels: segLabels.map(sg => sg.replace(/_/g, ' ')),
        datasets: [{ label: 'Customers', data: segLabels.map(sg => segments[sg] || 0),
          backgroundColor: segLabels.map(sg => segColors[sg] || '#999'), borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: { columns: [
        { key: 'customer_name', label: 'Customer' },
        { key: 'segment', label: 'Segment', type: 'badge', badgeMap: { CHAMPION: 'badge-green', LOYAL: 'badge-blue', AT_RISK: 'badge-yellow', NEEDS_ATTENTION: 'badge-yellow', LOST: 'badge-dark', NEW: 'badge-blue' } },
        { key: 'total_spent', label: 'Total Spent', type: 'currency' },
        { key: 'purchase_count', label: 'Orders', type: 'number' },
        { key: 'rfm_score', label: 'Score', type: 'number' }
      ], data: this.churnRiskData, emptyText: 'No customer data', maxHeight: '200px', exportable: true, exportFilename: 'churn-risk' },
      chartType: ct, viewMode: (this.cardViewModes['churn-risk'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildCashFlowCard(): InsightCard {
    const s = this.cashFlowSummary;
    const sev: 'critical'|'warning'|'healthy' = this.cashFlowLoading ? 'healthy' : s.risk_level === 'HIGH' ? 'critical' : s.risk_level === 'MEDIUM' ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['cash-flow'] || 'combo';

    const labels = this.cashFlowData.map((w: any) => 'W' + w.week);
    const inflows = this.cashFlowData.map((w: any) => w.inflow || 0);
    const outflows = this.cashFlowData.map((w: any) => w.total_outflow || 0);
    const cumulative = this.cashFlowData.map((w: any) => w.cumulative || 0);

    return {
      id: 'cash-flow', title: 'Cash Flow Forecast', icon: '💸', severity: sev, loading: this.cashFlowLoading,
      metrics: [
        { value: this.formatCurrency(s.net_flow), label: 'Net Flow', color: s.net_flow >= 0 ? '#52c41a' : '#ff4d4f' },
        { value: this.formatCurrency(s.total_inflow), label: 'Inflow', color: '#52c41a' },
        { value: this.formatCurrency(s.total_outflow), label: 'Outflow', color: '#ff4d4f' }
      ],
      insight: s.risk_level === 'HIGH' ? 'Cash flow risk HIGH — projected outflows exceed inflows. Review expenses and accelerate receivables.'
        : s.risk_level === 'MEDIUM' ? 'Cash flow risk MEDIUM. Margins thin — avoid large unplanned expenses.'
        : s.net_flow > 0 ? 'Positive net cash flow at ' + this.formatCurrency(s.net_flow) + '. Cash position is healthy.' : 'Cash flow data analysis complete.',
      chartConfig: { chartType: ct, labels,
        datasets: [
          { label: 'Inflow', data: inflows, backgroundColor: '#52c41a', borderRadius: 3 },
          { label: 'Outflow', data: outflows, backgroundColor: '#ff4d4f', borderRadius: 3 },
          { label: 'Cumulative', data: cumulative, type: 'line', borderColor: '#1890ff', borderWidth: 2, fill: false, backgroundColor: '#1890ff' }
        ], height: 220 },
      tableConfig: { columns: [
        { key: 'week', label: 'Week', type: 'number' },
        { key: 'inflow', label: 'Inflow', type: 'currency' },
        { key: 'total_outflow', label: 'Outflow', type: 'currency' },
        { key: 'cumulative', label: 'Cumulative', type: 'currency' }
      ], data: this.cashFlowData, emptyText: 'No cash flow data', maxHeight: '200px', exportable: true, exportFilename: 'cash-flow' },
      chartType: ct, viewMode: (this.cardViewModes['cash-flow'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildExpenseAnomalyCard(): InsightCard {
    const s = this.expenseAnomalySummary;
    const sev: 'critical'|'warning'|'healthy' = this.expenseAnomalyLoading ? 'healthy' : s.critical > 0 ? 'critical' : s.total_anomalies > 0 ? 'warning' : 'healthy';
    return {
      id: 'expense-anomaly', title: 'Expense Anomalies', icon: '⚠️', severity: sev, loading: this.expenseAnomalyLoading,
      metrics: [
        { value: s.total_anomalies, label: 'Anomalies', color: '#ff4d4f' },
        { value: this.formatCurrency(s.total_excess_amount), label: 'Excess Spend', color: '#ff4d4f' },
        { value: s.categories_affected, label: 'Categories', color: '#faad14' }
      ],
      insight: s.total_anomalies > 0
        ? s.total_anomalies + ' expense anomalies detected totaling ' + this.formatCurrency(s.total_excess_amount) + ' excess. ' + s.critical + ' critical, ' + s.warning + ' warning.'
        : 'No expense anomalies detected. All spending within expected ranges.',
      chartConfig: null,
      tableConfig: { columns: [
        { key: 'category_name', label: 'Category' },
        { key: 'month_total', label: 'Spent', type: 'currency' },
        { key: 'category_mean', label: 'Average', type: 'currency' },
        { key: 'excess_amount', label: 'Excess', type: 'currency' },
        { key: 'severity', label: 'Level', type: 'badge', badgeMap: { CRITICAL: 'badge-red', WARNING: 'badge-yellow' } }
      ], data: this.expenseAnomalyData, emptyText: 'No anomalies', maxHeight: '200px', exportable: true, exportFilename: 'expense-anomalies' },
      chartType: 'bar', viewMode: 'table', hasChart: false, hasTable: true, lastUpdated: null
    };
  }

  private _buildPriceVarianceCard(): InsightCard {
    const s = this.priceVarianceSummary;
    const sev: 'critical'|'warning'|'healthy' = this.priceVarianceLoading ? 'healthy' : s.total_overspend > 0 ? 'warning' : 'healthy';
    return {
      id: 'price-variance', title: 'Price Variance', icon: '📉', severity: sev, loading: this.priceVarianceLoading,
      metrics: [
        { value: this.formatCurrency(s.total_overspend), label: 'Overspend', color: '#ff4d4f' },
        { value: s.overspend_items, label: 'Items', color: '#faad14' },
        { value: s.increasing_price_trends, label: 'Rising Prices', color: '#ff4d4f' }
      ],
      insight: s.total_overspend > 0
        ? this.formatCurrency(s.total_overspend) + ' potential savings from ' + s.overspend_items + ' overpriced purchases. Switch vendors to best rate.'
        : 'No price overspend detected. All purchases at optimal rates.',
      chartConfig: null,
      tableConfig: { columns: [
        { key: 'product_name', label: 'Product' },
        { key: 'vendor_name', label: 'Vendor' },
        { key: 'avg_rate', label: 'Avg Rate', type: 'currency' },
        { key: 'best_rate', label: 'Best Rate', type: 'currency' },
        { key: 'overspend', label: 'Overspend', type: 'currency' }
      ], data: this.priceVarianceData, emptyText: 'No price data', maxHeight: '200px', exportable: true, exportFilename: 'price-variance' },
      chartType: 'bar', viewMode: 'table', hasChart: false, hasTable: true, lastUpdated: null
    };
  }

  private _buildRawMaterialCard(): InsightCard {
    const s = this.rawMaterialSummary;
    const sev: 'critical'|'warning'|'healthy' = this.rawMaterialLoading ? 'healthy' : s.critical_count > 0 ? 'critical' : s.warning_count > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['raw-material'] || 'doughnut';
    return {
      id: 'raw-material', title: 'Raw Material Forecast', icon: '🧪', severity: sev, loading: this.rawMaterialLoading,
      metrics: [
        { value: s.total_raw_materials, label: 'Materials', color: '#1890ff' },
        { value: s.critical_count, label: 'Critical', color: '#ff4d4f' },
        { value: s.warning_count, label: 'Warning', color: '#faad14' }
      ],
      insight: s.critical_count > 0
        ? s.critical_count + ' raw material(s) critically low (< 15 days). ' + s.warning_count + ' in warning zone. Procure immediately to avoid production halt.'
        : s.warning_count > 0 ? s.warning_count + ' raw material(s) in warning zone. Plan procurement to maintain safety stock.'
        : 'All raw materials at safe stock levels.',
      chartConfig: { chartType: ct, labels: ['Critical', 'Warning', 'Safe'],
        datasets: [{ label: 'Materials', data: [s.critical_count, s.warning_count, s.safe_count],
          backgroundColor: ['#ff4d4f', '#faad14', '#52c41a'], borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: { columns: [
        { key: 'product_name', label: 'Material' },
        { key: 'current_balance', label: 'Balance', type: 'number' },
        { key: 'avg_daily_consumption', label: 'Daily Use', type: 'number' },
        { key: 'days_remaining', label: 'Days Left', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge', badgeMap: { RED: 'badge-red', YELLOW: 'badge-yellow', GREEN: 'badge-green' } }
      ], data: this.rawMaterialData, emptyText: 'No raw material data', maxHeight: '200px', exportable: true, exportFilename: 'raw-material-forecast' },
      chartType: ct, viewMode: (this.cardViewModes['raw-material'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildProfitMarginCard(): InsightCard {
    const s = this.profitMarginSummary;
    const sev: 'critical'|'warning'|'healthy' = this.profitMarginLoading ? 'healthy' : s.red_count > 0 ? 'critical' : s.yellow_count > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['profit-margin'] || 'doughnut';
    return {
      id: 'profit-margin', title: 'Profit Margins', icon: '💹', severity: sev, loading: this.profitMarginLoading,
      metrics: [
        { value: this.formatCurrency(s.total_revenue), label: 'Revenue', color: '#1890ff' },
        { value: this.formatCurrency(s.total_profit), label: 'Profit', color: s.total_profit >= 0 ? '#52c41a' : '#ff4d4f' },
        { value: (s.overall_margin || 0).toFixed(1) + '%', label: 'Overall Margin', color: s.overall_margin >= 20 ? '#52c41a' : s.overall_margin >= 10 ? '#faad14' : '#ff4d4f' }
      ],
      insight: s.red_count > 0
        ? s.red_count + ' product(s) with unhealthy margins (< 10%). Overall margin: ' + (s.overall_margin || 0).toFixed(1) + '%. Review pricing or reduce costs.'
        : s.yellow_count > 0 ? s.yellow_count + ' product(s) in caution zone (10-20% margin). Monitor and optimize.'
        : 'All products have healthy profit margins (≥ 20%).',
      chartConfig: { chartType: ct, labels: ['Unhealthy (<10%)', 'Caution (10-20%)', 'Healthy (≥20%)'],
        datasets: [{ label: 'Products', data: [s.red_count, s.yellow_count, s.green_count],
          backgroundColor: ['#ff4d4f', '#faad14', '#52c41a'], borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: { columns: [
        { key: 'product_name', label: 'Product' },
        { key: 'revenue', label: 'Revenue', type: 'currency' },
        { key: 'cost', label: 'Cost', type: 'currency' },
        { key: 'profit', label: 'Profit', type: 'currency' },
        { key: 'margin_pct', label: 'Margin %', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge', badgeMap: { RED: 'badge-red', YELLOW: 'badge-yellow', GREEN: 'badge-green' } }
      ], data: this.profitMarginData, emptyText: 'No margin data', maxHeight: '200px', exportable: true, exportFilename: 'profit-margins' },
      chartType: ct, viewMode: (this.cardViewModes['profit-margin'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildMoneyBleedingCard(): InsightCard {
    const s = this.moneyBleedingSummary;
    const sev: 'critical'|'warning'|'healthy' = this.moneyBleedingLoading ? 'healthy' : s.critical_count > 0 ? 'critical' : s.high_count > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['money-bleeding'] || 'doughnut';

    const moduleBreakdown = s.module_breakdown || [];
    const modLabels = moduleBreakdown.map((m: any) => m.module);
    const modData = moduleBreakdown.map((m: any) => m.amount);
    const modColors = ['#ff4d4f', '#faad14', '#1890ff', '#52c41a', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

    return {
      id: 'money-bleeding', title: 'Money Bleeding', icon: '🩸', severity: sev, loading: this.moneyBleedingLoading,
      metrics: [
        { value: this.formatCurrency(s.total_bleeding), label: 'Total Bleeding', color: '#ff4d4f' },
        { value: s.critical_count, label: 'Critical', color: '#ff4d4f' },
        { value: s.modules_affected, label: 'Modules', color: '#faad14' }
      ],
      insight: s.critical_count > 0
        ? this.formatCurrency(s.total_bleeding) + ' leaking across ' + s.modules_affected + ' modules. ' + s.critical_count + ' critical area(s). Immediate action required.'
        : s.total_bleeding > 0 ? this.formatCurrency(s.total_bleeding) + ' total bleeding across ' + s.total_categories + ' categories. Review and optimize.'
        : 'No significant money bleeding detected.',
      chartConfig: { chartType: ct, labels: modLabels,
        datasets: [{ label: 'Amount', data: modData,
          backgroundColor: modColors.slice(0, modLabels.length), borderWidth: 2, borderColor: '#fff' }], height: 200 },
      tableConfig: { columns: [
        { key: 'label', label: 'Category' },
        { key: 'module', label: 'Module' },
        { key: 'amount', label: 'Amount', type: 'currency' },
        { key: 'percentage', label: '%', type: 'number' },
        { key: 'severity', label: 'Level', type: 'badge', badgeMap: { CRITICAL: 'badge-red', HIGH: 'badge-yellow', MEDIUM: 'badge-blue', LOW: 'badge-green' } }
      ], data: this.moneyBleedingData, emptyText: 'No bleeding data', maxHeight: '200px', exportable: true, exportFilename: 'money-bleeding' },
      chartType: ct, viewMode: (this.cardViewModes['money-bleeding'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildSeasonalityCard(): InsightCard {
    const s = this.seasonalitySummary;
    const sev: 'critical'|'warning'|'healthy' = this.seasonalityLoading ? 'healthy' : s.products_with_seasonal_peaks > 0 ? 'warning' : 'healthy';
    const ct: ChartType = this.cardChartTypes['seasonality'] || 'bar';

    const monthTotals = s.month_totals || [];
    const labels = monthTotals.map((m: any) => m.month);
    const data = monthTotals.map((m: any) => m.total_qty);
    const colors = data.map((v: number) => {
      const max = Math.max(...data, 1);
      const ratio = v / max;
      return ratio >= 0.7 ? '#ff4d4f' : ratio >= 0.4 ? '#faad14' : ratio > 0 ? '#1890ff' : '#e8e8e8';
    });

    return {
      id: 'seasonality', title: 'Sales Seasonality', icon: '📊', severity: sev, loading: this.seasonalityLoading,
      metrics: [
        { value: s.total_products_analyzed, label: 'Products', color: '#1890ff' },
        { value: s.busiest_month || '—', label: 'Busiest', color: '#ff4d4f' },
        { value: s.products_with_seasonal_peaks, label: 'With Peaks', color: '#faad14' }
      ],
      insight: s.busiest_month
        ? 'Busiest month: ' + s.busiest_month + ', slowest: ' + s.slowest_month + '. ' + s.products_with_seasonal_peaks + ' product(s) show seasonal peaks — plan stock accordingly.'
        : 'No seasonality data available yet.',
      chartConfig: { chartType: ct, labels,
        datasets: [{ label: 'Avg Qty Sold', data,
          backgroundColor: colors, borderWidth: 0, borderRadius: 4 }], height: 200 },
      tableConfig: { columns: [
        { key: 'product_name', label: 'Product' },
        { key: 'total_avg_qty', label: 'Avg Qty/Yr', type: 'number' },
        { key: 'peak_months', label: 'Peak Months', type: 'text' },
        { key: 'data_years', label: 'Years', type: 'number' }
      ], data: this.seasonalityData, emptyText: 'No seasonality data', maxHeight: '200px', exportable: true, exportFilename: 'seasonality' },
      chartType: ct, viewMode: (this.cardViewModes['seasonality'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }

  private _buildWhatIfCard(): InsightCard {
    const s = this.whatIfSummary;
    const sev: 'critical'|'warning'|'healthy' = this.whatIfLoading ? 'healthy' : !s.can_handle_growth ? (s.materials_short >= 3 ? 'critical' : 'warning') : 'healthy';
    const ct: ChartType = this.cardChartTypes['what-if'] || 'bar';

    const items = this.whatIfData.slice(0, 10);
    const labels = items.map((m: any) => m.product_name?.length > 18 ? m.product_name.substring(0, 18) + '...' : m.product_name);
    const shortfalls = items.map((m: any) => m.shortfall);
    const stocks = items.map((m: any) => m.current_stock);

    return {
      id: 'what-if', title: 'What-If Simulator', icon: '🔮', severity: sev, loading: this.whatIfLoading,
      metrics: [
        { value: s.materials_short, label: 'Short', color: '#ff4d4f' },
        { value: s.materials_ok, label: 'OK', color: '#52c41a' },
        { value: this.formatCurrency(s.total_additional_cost), label: 'Extra Cost', color: '#faad14' }
      ],
      insight: s.can_handle_growth
        ? 'At ' + s.growth_pct + '% growth over ' + s.forecast_months + ' months, all ' + s.total_materials_analyzed + ' materials have sufficient stock.'
        : s.materials_short + ' material(s) fall short at ' + s.growth_pct + '% growth. Est. ' + this.formatCurrency(s.total_additional_cost) + ' additional procurement needed over ' + s.forecast_months + ' months.',
      chartConfig: { chartType: ct, labels,
        datasets: [
          { label: 'Current Stock', data: stocks, backgroundColor: '#52c41a', borderRadius: 4 },
          { label: 'Shortfall', data: shortfalls, backgroundColor: '#ff4d4f', borderRadius: 4 }
        ], height: 200 },
      tableConfig: { columns: [
        { key: 'product_name', label: 'Material' },
        { key: 'current_stock', label: 'Stock', type: 'number' },
        { key: 'total_needed', label: 'Needed', type: 'number' },
        { key: 'shortfall', label: 'Shortfall', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge', badgeMap: { 'SHORT': 'ai-badge-red', 'OK': 'ai-badge-green' } }
      ], data: this.whatIfData, emptyText: 'No simulation data', maxHeight: '200px', exportable: true, exportFilename: 'what-if-simulation' },
      chartType: ct, viewMode: (this.cardViewModes['what-if'] as any) || 'chart', hasChart: true, hasTable: true, lastUpdated: null
    };
  }
}
