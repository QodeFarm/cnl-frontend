// ═══════════════════════════════════════════════════
// Widget Configuration — Core interfaces for the
// dynamic AI Dashboard widget system
// ═══════════════════════════════════════════════════

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'combo';
export type WidgetType = 'chart' | 'kpi' | 'table' | 'insight';

export interface WidgetConfig {
  widgetId: string;
  title: string;
  widgetType: WidgetType;
  chartType: ChartType;
  dataSource: string;           // API endpoint key (e.g. 'low-stock', 'debt-defaulters')
  category: string;             // 'finance' | 'sales' | 'inventory' | 'purchase' | 'production'
  visible: boolean;
  size: 'sm' | 'md' | 'lg';    // sm = col-4, md = col-6, lg = col-12
}

export interface WidgetData {
  loading: boolean;
  error: boolean;
  data: any[];
  summary: any;
  lastUpdated: Date | null;
}

export interface KpiConfig {
  value: string | number;
  label: string;
  subtitle: string;
  indicator: 'red' | 'yellow' | 'green' | 'blue' | 'dark';
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  clickAction?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'badge' | 'number' | 'date';
  badgeMap?: { [key: string]: string };  // value → badge color class
  width?: string;
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  emptyText?: string;
  maxHeight?: string;
  exportable?: boolean;
  exportFilename?: string;
}

export interface ChartConfig {
  chartType: ChartType;
  labels: string[];
  datasets: ChartDataset[];
  stacked?: boolean;
  horizontal?: boolean;
  showLegend?: boolean;
  height?: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number;
  type?: string;   // for combo charts
  fill?: boolean;
  yAxisID?: string;
}

// ═══════════════════════════════════════════════════
// Insight Card — Severity-sorted smart dashboard card
// ═══════════════════════════════════════════════════

export interface InsightCard {
  id: string;
  title: string;
  icon: string;
  severity: 'critical' | 'warning' | 'healthy';
  loading: boolean;
  metrics: CardMetric[];
  insight: string;
  chartConfig: ChartConfig | null;
  tableConfig: TableConfig | null;
  chartType: ChartType;
  viewMode: 'chart' | 'table';
  hasChart: boolean;
  hasTable: boolean;
  lastUpdated: Date | null;
}

export interface CardMetric {
  value: string | number;
  label: string;
  color?: string;
}

// ═══════════════════════════════════════════════════
// Dashboard Customization — User preferences
// ═══════════════════════════════════════════════════

/** Each toggleable widget in a tab */
export interface DashboardWidget {
  id: string;           // e.g. 'finance-report1', 'sales-card-inactive'
  label: string;        // display name in drawer
  tab: string;          // 'finance' | 'sales' | 'inventory' | 'purchase' | 'production'
  type: 'card' | 'report' | 'table';  // widget category
  visible: boolean;     // current visibility
}

/** Stored in localStorage */
export interface DashboardPreferences {
  hiddenWidgets: string[];      // list of widget ids that are hidden
  chartDefaults: { [widgetId: string]: string };  // widget id → chart type
}

// ═══════════════════════════════════════════════════
// Dynamic Tab System — Config-driven data tabs
// ═══════════════════════════════════════════════════

/** Full configuration for a data tab (Finance, Sales, etc.) */
export interface TabConfig {
  key: string;
  label: string;
  insightKey: string;
  cards: TabCardConfig[];
  reports: TabReportConfig[];
  extraSections?: TabExtraSectionConfig[];
}

/** Summary card within a tab header */
export interface TabCardConfig {
  colClass: string;
  title: string;
  indicatorClass: (ctx: any) => string;
  value: (ctx: any) => string | number;
  subtitle: (ctx: any) => string;
}

/** Chart + Table report section */
export interface TabReportConfig {
  widgetId: string;
  drawerLabel: string;
  isFirst?: boolean;
  chart: TabChartConfig;
  table: TabTableConfig;
}

/** Chart portion of a report */
export interface TabChartConfig {
  id: string;
  modes: { value: string; label: string }[];
  defaultMode: string;
  loadingKey: string;
  dataKey?: string;
  emptyText: string;
  build: (ctx: any, mode: string) => any;
}

/** Table portion of a report */
export interface TabTableConfig {
  title: string;
  subtitle?: string;
  columns: TabColumn[];
  dataKey: string;
  loadingKey: string;
  emptyText: string;
}

/** Column definition for dynamic table rendering */
export interface TabColumn {
  key?: string;
  label: string;
  type?: 'text' | 'currency' | 'badge' | 'number' | 'action' | 'custom' | 'pipe' | 'link';
  pipeFormat?: string;
  badgeClass?: (item: any, ctx?: any) => string;
  badgeLabel?: (item: any, ctx?: any) => string;
  cellClass?: string | ((item: any) => string);
  render?: (item: any, ctx: any) => string;
  actionText?: (ctx: any, item: any) => string;
  actionDisabled?: (ctx: any, item: any) => boolean;
  actionHandler?: string;
  linkRoute?: string | ((item: any) => string);
  linkText?: string;
}

/** Standalone table sections (e.g. Dead Stock + Demand Forecast side-by-side) */
export interface TabExtraSectionConfig {
  widgetId: string;
  drawerLabel: string;
  tables: TabStandaloneTable[];
}

/** Individual standalone table */
export interface TabStandaloneTable {
  colClass: string;
  title: string;
  subtitle?: string;
  columns: TabColumn[];
  dataKey: string;
  loadingKey: string;
  emptyText: string;
}
