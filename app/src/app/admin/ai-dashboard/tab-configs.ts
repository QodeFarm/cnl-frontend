import { TabConfig } from './models/widget.models';

// ═══════════════════════════════════════════════════
// Static currency formatter for chart tooltip callbacks
// (chart callbacks don't have component context)
// ═══════════════════════════════════════════════════
function fmtCur(value: number): string {
  if (value == null || isNaN(value)) return '₹0';
  if (value >= 10000000) return '₹' + (value / 10000000).toFixed(2) + ' Cr';
  if (value >= 100000) return '₹' + (value / 100000).toFixed(2) + ' L';
  if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + ' K';
  return '₹' + value.toFixed(0);
}

// ═══════════════════════════════════════════════════
// Helper: Build standard categorical chart config
// Used by most charts (doughnut/pie/bar with labels + data)
// ═══════════════════════════════════════════════════
function buildCategorical(
  mode: string, labels: string[], data: number[], colors: string[], title: string,
  opts?: { legendAlways?: boolean; tooltipCurrency?: boolean; tooltipPercent?: boolean;
           yMax?: number; yStep?: number; indexAxis?: string; label?: string }
): any {
  const type = mode as any;
  const isCircular = type === 'doughnut' || type === 'pie';
  const showLegend = opts?.legendAlways !== false || isCircular;
  return {
    type,
    data: {
      labels,
      datasets: [{
        label: opts?.label || title,
        data,
        backgroundColor: colors,
        borderWidth: isCircular ? 2 : 0,
        borderColor: '#fff',
        ...(isCircular ? {} : { borderRadius: 4, barPercentage: 0.6 })
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: isCircular,
      ...(isCircular ? { aspectRatio: 1 } : {}),
      ...(type === 'doughnut' ? { cutout: '65%' } : {}),
      ...(opts?.indexAxis ? { indexAxis: opts.indexAxis } : {}),
      scales: isCircular ? undefined : {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#555', maxRotation: 45 } },
        y: {
          beginAtZero: true,
          ...(opts?.yMax ? { max: opts.yMax } : {}),
          grid: { color: '#f0f0f0' },
          ticks: {
            font: { size: 11 }, color: '#555',
            ...(opts?.yStep ? { stepSize: opts.yStep } : {}),
            ...(opts?.tooltipCurrency ? { callback: (v: any) => fmtCur(v) } : {}),
            ...(opts?.tooltipPercent ? { callback: (v: any) => v + '%' } : {})
          }
        }
      },
      plugins: {
        legend: { display: showLegend, position: 'bottom', labels: { font: { size: isCircular ? 12 : 11 }, padding: isCircular ? 12 : 10, usePointStyle: true } },
        title: { display: true, text: title, color: '#2c2e35', font: { size: 14, weight: 'bold' } },
        ...(opts?.tooltipCurrency ? {
          tooltip: { callbacks: { label: (c: any) => (c.dataset.label || c.label) + ': ' + fmtCur(c.raw) } }
        } : opts?.tooltipPercent ? {
          tooltip: { callbacks: { label: (c: any) => (c.dataset.label || c.label) + ': ' + c.raw + '%' } }
        } : {})
      }
    }
  };
}

// ═══════════════════════════════════════════════════
// TAB CONFIGURATIONS
// ═══════════════════════════════════════════════════

export const TAB_CONFIGS: TabConfig[] = [

  // ────────────────────────────────────────────────
  // FINANCE TAB
  // ────────────────────────────────────────────────
  {
    key: 'finance',
    label: 'Finance',
    insightKey: 'financeInsight',
    cards: [
      {
        colClass: 'col-md col-6',
        title: 'Total Overdue',
        indicatorClass: () => 'indicator-red',
        value: (c) => c.formatCurrency(c.debtSummary.total_overdue_amount),
        subtitle: (c) => (c.debtData ?? []).length + ' customer(s)'
      },
      {
        colClass: 'col-md col-6',
        title: 'Cash Flow Risk',
        indicatorClass: (c) => c.getCashFlowRiskClass(c.cashFlowSummary.risk_level),
        value: (c) => c.cashFlowSummary.risk_level,
        subtitle: (c) => 'Net: ' + c.formatCurrency(c.cashFlowSummary.net_flow)
      },
      {
        colClass: 'col-md col-6',
        title: 'Expense Anomalies',
        indicatorClass: (c) => c.expenseAnomalySummary.critical > 0 ? 'indicator-red' : c.expenseAnomalySummary.total_anomalies > 0 ? 'indicator-yellow' : 'indicator-green',
        value: (c) => c.expenseAnomalySummary.total_anomalies,
        subtitle: (c) => c.formatCurrency(c.expenseAnomalySummary.total_excess_amount) + ' excess'
      },
      {
        colClass: 'col-md col-6',
        title: 'Profit Margins',
        indicatorClass: (c) => c.profitMarginSummary.red_count > 0 ? 'indicator-red' : c.profitMarginSummary.yellow_count > 0 ? 'indicator-yellow' : 'indicator-green',
        value: (c) => (c.profitMarginSummary.overall_margin || 0).toFixed(1) + '%',
        subtitle: (c) => c.profitMarginSummary.red_count + ' unhealthy, ' + c.profitMarginSummary.green_count + ' healthy'
      },
      {
        colClass: 'col-md col-6',
        title: 'Money Bleeding',
        indicatorClass: (c) => c.moneyBleedingSummary.critical_count > 0 ? 'indicator-red' : c.moneyBleedingSummary.total_bleeding > 0 ? 'indicator-yellow' : 'indicator-green',
        value: (c) => c.formatCurrency(c.moneyBleedingSummary.total_bleeding),
        subtitle: (c) => c.moneyBleedingSummary.critical_count + ' critical, ' + c.moneyBleedingSummary.modules_affected + ' modules'
      }
    ],
    reports: [
      {
        widgetId: 'finance-report1',
        drawerLabel: 'Debt Defaulters (Chart + Table)',
        isFirst: true,
        chart: {
          id: 'debt',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'debtLoading',
          dataKey: 'debtData',
          emptyText: 'No debt data',
          build: (c, mode) => {
            const s = c.debtSummary;
            return buildCategorical(mode, ['Critical', 'Warning', 'Mild'], [s.critical, s.warning, s.mild], ['#ff4d4f', '#faad14', '#52c41a'], 'Debt Risk Distribution');
          }
        },
        table: {
          title: 'Debt Defaulters',
          subtitle: 'Overdue payments by risk',
          columns: [
            { key: 'customer_name', label: 'Customer', linkRoute: '/customers' },
            { key: 'total_overdue_amount', label: 'Overdue', type: 'currency' },
            { key: 'overdue_invoices_count', label: 'Invoices' },
            { key: 'max_overdue_days', label: 'Days' },
            { key: 'risk_level', label: 'Risk', type: 'badge',
              badgeClass: (item) => ({ CRITICAL: 'ai-badge-red', WARNING: 'ai-badge-yellow', MILD: 'ai-badge-green' } as any)[item.risk_level] || '' },
            { label: 'Action', type: 'custom', cellClass: 'recommendation-text',
              render: (item, ctx) => ctx.getDebtRecommendation(item) }
          ],
          dataKey: 'debtData',
          loadingKey: 'debtLoading',
          emptyText: 'No overdue payments'
        }
      },
      {
        widgetId: 'finance-report2',
        drawerLabel: 'Cash Flow & Expense Anomalies',
        chart: {
          id: 'cashFlow',
          modes: [{ value: 'bar', label: 'Combo' }, { value: 'line', label: 'Line' }],
          defaultMode: 'bar',
          loadingKey: 'cashFlowLoading',
          dataKey: 'cashFlowData',
          emptyText: 'No cash flow data',
          build: (c, mode) => {
            const labels = c.cashFlowData.map((w: any) => 'W' + w.week);
            const inflows = c.cashFlowData.map((w: any) => w.inflow || 0);
            const outflows = c.cashFlowData.map((w: any) => w.total_outflow || 0);
            const netLine = c.cashFlowData.map((w: any) => w.cumulative || 0);
            const datasets = mode === 'line' ? [
              { label: 'Inflow', data: inflows, borderColor: '#52c41a', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#52c41a', fill: false, backgroundColor: '#52c41a' },
              { label: 'Outflow', data: outflows, borderColor: '#ff4d4f', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#ff4d4f', fill: false, backgroundColor: '#ff4d4f' },
              { label: 'Cumulative', data: netLine, borderColor: '#1890ff', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#1890ff', fill: false, backgroundColor: '#1890ff' }
            ] : [
              { label: 'Inflow', data: inflows, backgroundColor: '#52c41a', borderRadius: 3, barPercentage: 0.4 },
              { label: 'Outflow', data: outflows, backgroundColor: '#ff4d4f', borderRadius: 3, barPercentage: 0.4 },
              { label: 'Cumulative', data: netLine, type: 'line' as any, borderColor: '#1890ff', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#1890ff', fill: false, yAxisID: 'y' }
            ];
            return {
              type: mode === 'line' ? 'line' : 'bar',
              data: { labels, datasets },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#555' } },
                  y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#555', callback: (v: any) => fmtCur(v) } }
                },
                plugins: {
                  legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10, usePointStyle: true, pointStyleWidth: 8 } },
                  title: { display: true, text: 'Weekly Cash Flow Forecast', color: '#2c2e35', font: { size: 14, weight: 'bold' }, padding: { bottom: 8 } },
                  tooltip: { callbacks: { label: (tc: any) => tc.dataset.label + ': ' + fmtCur(tc.raw) } }
                }
              }
            };
          }
        },
        table: {
          title: 'Expense Anomalies',
          subtitle: 'Spending above expected range',
          columns: [
            { key: 'category_name', label: 'Category' },
            { key: 'month_total', label: 'Spent', type: 'currency' },
            { key: 'category_mean', label: 'Average', type: 'currency' },
            { key: 'excess_amount', label: 'Excess', type: 'currency', cellClass: 'text-danger' },
            { key: 'severity', label: 'Level', type: 'badge',
              badgeClass: (item) => ({ CRITICAL: 'ai-badge-red', WARNING: 'ai-badge-yellow' } as any)[item.severity] || '' }
          ],
          dataKey: 'expenseAnomalyData',
          loadingKey: 'expenseAnomalyLoading',
          emptyText: 'No anomalies detected'
        }
      },
      {
        widgetId: 'finance-report3',
        drawerLabel: 'Profit Margins (Chart + Table)',
        chart: {
          id: 'profitMargin',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'profitMarginLoading',
          dataKey: 'profitMarginData',
          emptyText: 'No margin data',
          build: (c, mode) => {
            const s = c.profitMarginSummary;
            return buildCategorical(mode, ['Unhealthy (<10%)', 'Caution (10-20%)', 'Healthy (≥20%)'],
              [s.red_count, s.yellow_count, s.green_count], ['#ff4d4f', '#faad14', '#52c41a'], 'Profit Margin Distribution');
          }
        },
        table: {
          title: 'Profit Margins',
          subtitle: 'Revenue, cost & margin per product',
          columns: [
            { key: 'product_name', label: 'Product', linkRoute: '/products' },
            { key: 'revenue', label: 'Revenue', type: 'currency' },
            { key: 'cost', label: 'Cost', type: 'currency' },
            { key: 'profit', label: 'Profit', type: 'currency',
              cellClass: (item) => item.profit < 0 ? 'text-danger' : 'text-success-val' },
            { key: 'margin_pct', label: 'Margin %', type: 'custom',
              render: (item) => (item.margin_pct || 0).toFixed(1) + '%' },
            { key: 'status', label: 'Status', type: 'badge',
              badgeClass: (item) => ({ RED: 'ai-badge-red', YELLOW: 'ai-badge-yellow', GREEN: 'ai-badge-green' } as any)[item.status] || '' }
          ],
          dataKey: 'profitMarginData',
          loadingKey: 'profitMarginLoading',
          emptyText: 'No margin data'
        }
      },
      {
        widgetId: 'finance-report4',
        drawerLabel: 'Money Bleeding (Chart + Table)',
        chart: {
          id: 'moneyBleeding',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'moneyBleedingLoading',
          dataKey: 'moneyBleedingData',
          emptyText: 'No bleeding data',
          build: (c, mode) => {
            const breakdown = c.moneyBleedingSummary.module_breakdown || [];
            const labels = breakdown.map((m: any) => m.module);
            const data = breakdown.map((m: any) => m.amount);
            const palette = ['#ff4d4f', '#faad14', '#1890ff', '#52c41a', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];
            return buildCategorical(mode, labels, data, palette.slice(0, labels.length),
              'Money Bleeding by Module', { tooltipCurrency: true });
          }
        },
        table: {
          title: 'Money Bleeding',
          subtitle: 'Revenue leaks by category',
          columns: [
            { key: 'label', label: 'Category' },
            { key: 'module', label: 'Module' },
            { key: 'amount', label: 'Amount', type: 'currency' },
            { key: 'percentage', label: '%', type: 'custom',
              render: (item) => (item.percentage || 0).toFixed(1) + '%' },
            { key: 'severity', label: 'Level', type: 'badge',
              badgeClass: (item) => ({ CRITICAL: 'ai-badge-red', HIGH: 'ai-badge-yellow', MEDIUM: 'ai-badge-blue', LOW: 'ai-badge-green' } as any)[item.severity] || '' },
            { label: '', type: 'link', linkRoute: (item) => item.module === 'Sales' ? '/reports/sales-reports' : item.module === 'Purchase' ? '/reports/purchase-reports' : '/finance/financial-report', linkText: 'View' }
          ],
          dataKey: 'moneyBleedingData',
          loadingKey: 'moneyBleedingLoading',
          emptyText: 'No bleeding data'
        }
      }
    ]
  },

  // ────────────────────────────────────────────────
  // SALES TAB
  // ────────────────────────────────────────────────
  {
    key: 'sales',
    label: 'Sales',
    insightKey: 'salesInsight',
    cards: [
      {
        colClass: 'col-md-3 col-6',
        title: 'Inactive Customers',
        indicatorClass: () => 'indicator-yellow',
        value: (c) => c.inactiveData.length,
        subtitle: (c) => ((c.inactiveSummary.lost || 0) + (c.inactiveSummary.critical || 0) + (c.inactiveSummary.warning || 0)) + ' need follow-up'
      },
      {
        colClass: 'col-md-3 col-6',
        title: 'At Risk / Lost',
        indicatorClass: (c) => (c.churnRiskSummary.at_risk + c.churnRiskSummary.lost) > 0 ? 'indicator-red' : 'indicator-green',
        value: (c) => (c.churnRiskSummary.at_risk || 0) + (c.churnRiskSummary.lost || 0),
        subtitle: (c) => (c.churnRiskSummary.lost || 0) + ' lost, ' + (c.churnRiskSummary.at_risk || 0) + ' at risk'
      },
      {
        colClass: 'col-md-3 col-6',
        title: 'Champions (RFM)',
        indicatorClass: () => 'indicator-green',
        value: (c) => c.churnRiskSummary.champions,
        subtitle: (c) => 'of ' + c.churnRiskSummary.total_customers + ' customers'
      },
      {
        colClass: 'col-md-3 col-6',
        title: 'Seasonality',
        indicatorClass: (c) => c.seasonalitySummary.products_with_seasonal_peaks > 0 ? 'indicator-yellow' : 'indicator-green',
        value: (c) => c.seasonalitySummary.total_products_analyzed,
        subtitle: (c) => 'Peak: ' + (c.seasonalitySummary.busiest_month || '—')
      }
    ],
    reports: [
      {
        widgetId: 'sales-report1',
        drawerLabel: 'Inactive Customers (Chart + Table)',
        isFirst: true,
        chart: {
          id: 'inactive',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'inactiveLoading',
          dataKey: 'inactiveData',
          emptyText: 'No inactive customers',
          build: (c, mode) => {
            const s = c.inactiveSummary;
            return buildCategorical(mode, ['Lost', 'Critical', 'Warning', 'At Risk'], [s.lost, s.critical, s.warning, s.at_risk], ['#434343', '#ff4d4f', '#faad14', '#1890ff'], 'Customer Inactivity Distribution');
          }
        },
        table: {
          title: 'Inactive Customers',
          subtitle: 'No orders in extended period',
          columns: [
            { key: 'customer_name', label: 'Customer', linkRoute: '/customers' },
            { key: 'days_inactive', label: 'Days Inactive' },
            { key: 'total_invoices', label: 'Orders' },
            { key: 'risk_level', label: 'Risk', type: 'badge',
              badgeClass: (item) => ({ LOST: 'ai-badge-dark', CRITICAL: 'ai-badge-red', WARNING: 'ai-badge-yellow', AT_RISK: 'ai-badge-blue' } as any)[item.risk_level] || '' },
            { label: 'Action', type: 'custom', cellClass: 'recommendation-text',
              render: (item, ctx) => ctx.getInactiveRecommendation(item) }
          ],
          dataKey: 'inactiveData',
          loadingKey: 'inactiveLoading',
          emptyText: 'No inactive customers'
        }
      },
      {
        widgetId: 'sales-report2',
        drawerLabel: 'Churn Risk & RFM Segments',
        chart: {
          id: 'churnRisk',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'churnRiskLoading',
          dataKey: 'churnRiskData',
          emptyText: 'No churn data',
          build: (c, mode) => {
            const segments: any = {};
            c.churnRiskData.forEach((cr: any) => { segments[cr.segment] = (segments[cr.segment] || 0) + 1; });
            const segOrder = ['CHAMPION', 'LOYAL', 'NEW', 'NEEDS_ATTENTION', 'AT_RISK', 'LOST'];
            const segColors: any = { CHAMPION: '#52c41a', LOYAL: '#1890ff', NEW: '#13c2c2', NEEDS_ATTENTION: '#faad14', AT_RISK: '#ff7a45', LOST: '#434343' };
            const labels = segOrder.filter(s => segments[s]);
            const data = labels.map(s => segments[s]);
            const colors = labels.map(s => segColors[s] || '#999');
            return buildCategorical(mode, labels.map(s => s.replace(/_/g, ' ')), data, colors, 'Customer Segments (RFM)');
          }
        },
        table: {
          title: 'Customer Segments (RFM)',
          subtitle: 'Recency-Frequency-Monetary analysis',
          columns: [
            { key: 'customer_name', label: 'Customer', linkRoute: '/customers' },
            { key: 'segment', label: 'Segment', type: 'badge',
              badgeClass: (item) => ({ CHAMPION: 'ai-badge-green', LOYAL: 'ai-badge-blue', AT_RISK: 'ai-badge-yellow', NEEDS_ATTENTION: 'ai-badge-yellow', LOST: 'ai-badge-dark', NEW: 'ai-badge-blue' } as any)[item.segment] || 'ai-badge-blue',
              badgeLabel: (item) => (item.segment || '').replace(/_/g, ' ') },
            { key: 'total_spent', label: 'Total Spent', type: 'currency' },
            { key: 'purchase_count', label: 'Orders' },
            { key: 'rfm_score', label: 'Score', type: 'badge',
              badgeClass: (item) => item.rfm_score >= 4 ? 'ai-badge-green' : item.rfm_score >= 2.5 ? 'ai-badge-blue' : item.rfm_score >= 1.5 ? 'ai-badge-yellow' : 'ai-badge-red',
              badgeLabel: (item) => item.rfm_score?.toFixed(1) || '—' }
          ],
          dataKey: 'churnRiskData',
          loadingKey: 'churnRiskLoading',
          emptyText: 'No customer data'
        }
      },
      {
        widgetId: 'sales-report3',
        drawerLabel: 'Sales Seasonality Heatmap',
        chart: {
          id: 'seasonality',
          modes: [{ value: 'bar', label: 'Bar' }, { value: 'line', label: 'Line' }, { value: 'doughnut', label: 'Doughnut' }],
          defaultMode: 'bar',
          loadingKey: 'seasonalityLoading',
          dataKey: 'seasonalityData',
          emptyText: 'No seasonality data',
          build: (c, mode) => {
            const monthTotals = c.seasonalitySummary.month_totals || [];
            const labels = monthTotals.map((m: any) => m.month);
            const data = monthTotals.map((m: any) => m.total_qty);
            const maxVal = Math.max(...data, 1);
            const colors = data.map((v: number) => {
              const ratio = v / maxVal;
              return ratio >= 0.7 ? '#ff4d4f' : ratio >= 0.4 ? '#faad14' : ratio > 0 ? '#1890ff' : '#e8e8e8';
            });
            if (mode === 'line') {
              return {
                type: 'line',
                data: { labels, datasets: [{ label: 'Avg Monthly Sales', data, borderColor: '#1890ff', borderWidth: 2, pointRadius: 4, pointBackgroundColor: colors, fill: true, backgroundColor: 'rgba(24,144,255,0.1)' }] },
                options: {
                  responsive: true, maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#555' } },
                    y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#555' } }
                  },
                  plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Monthly Sales Volume (Avg)', color: '#2c2e35', font: { size: 14, weight: 'bold' } }
                  }
                }
              };
            }
            return buildCategorical(mode, labels, data, colors, 'Monthly Sales Volume (Avg)', { legendAlways: false });
          }
        },
        table: {
          title: 'Sales Seasonality',
          subtitle: 'Product peak & low months',
          columns: [
            { key: 'product_name', label: 'Product', linkRoute: '/products' },
            { key: 'total_avg_qty', label: 'Avg Qty/Yr', type: 'pipe', pipeFormat: '1.0-0' },
            { key: 'peak_months', label: 'Peak Months', type: 'custom',
              render: (item) => (item.peak_months || []).join(', ') || '—' },
            { key: 'low_months', label: 'Low Months', type: 'custom',
              render: (item) => (item.low_months || []).join(', ') || '—' },
            { key: 'data_years', label: 'Years' }
          ],
          dataKey: 'seasonalityData',
          loadingKey: 'seasonalityLoading',
          emptyText: 'No seasonality data'
        }
      }
    ]
  },

  // ────────────────────────────────────────────────
  // INVENTORY TAB
  // ────────────────────────────────────────────────
  {
    key: 'inventory',
    label: 'Inventory',
    insightKey: 'inventoryInsight',
    cards: [
      {
        colClass: 'col-md-3 col-6',
        title: 'Low Stock',
        indicatorClass: () => 'indicator-red',
        value: (c) => c.lowStockCount,
        subtitle: (c) => c.lowStockSummary.critical + ' out of stock'
      },
      {
        colClass: 'col-md-3 col-6',
        title: 'Forecast Critical',
        indicatorClass: () => 'indicator-yellow',
        value: (c) => c.forecastRedCount,
        subtitle: () => 'Will run out in 7 days'
      },
      {
        colClass: 'col-md-3 col-6',
        title: 'Dead Stock',
        indicatorClass: () => 'indicator-yellow',
        value: (c) => c.deadStockSummary.total_dead_products,
        subtitle: (c) => c.formatCurrency(c.deadStockSummary.total_dead_stock_value) + ' blocked'
      },
      {
        colClass: 'col-md-3 col-6',
        title: 'Demand Trends',
        indicatorClass: () => 'indicator-blue',
        value: (c) => c.demandForecastSummary.total_analyzed,
        subtitle: (c) => c.demandForecastSummary.trending_down + ' declining'
      }
    ],
    reports: [
      {
        widgetId: 'inventory-report1',
        drawerLabel: 'Stock Health (Chart + Table)',
        isFirst: true,
        chart: {
          id: 'stockHealth',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'lowStockLoading',
          emptyText: 'No stock data',
          build: (c, mode) => {
            const s = c.lowStockSummary;
            return buildCategorical(mode, ['Out of Stock', 'High Risk', 'Low Stock'], [s.critical, s.high, s.medium], ['#ff4d4f', '#faad14', '#1890ff'], 'Stock Health Distribution');
          }
        },
        table: {
          title: 'Low Stock Items',
          columns: [
            { key: 'name', label: 'Product', linkRoute: '/products' },
            { key: 'balance', label: 'Stock' },
            { key: 'minimum_level', label: 'Min Level' },
            { key: 'reorder_qty', label: 'Reorder Qty' },
            { key: 'severity', label: 'Status', type: 'badge',
              badgeClass: (item) => ({ critical: 'ai-badge-red', high: 'ai-badge-yellow', medium: 'ai-badge-blue' } as any)[item.severity] || '',
              badgeLabel: (item) => item.severity === 'critical' ? 'Out of Stock' : item.severity === 'high' ? 'High Risk' : 'Low Stock' }
          ],
          dataKey: 'lowStockData',
          loadingKey: 'lowStockLoading',
          emptyText: 'No low stock'
        }
      },
      {
        widgetId: 'inventory-report2',
        drawerLabel: 'Stock Forecast (Chart + Table)',
        chart: {
          id: 'topAtRisk',
          modes: [{ value: 'bar', label: 'Bar' }, { value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }],
          defaultMode: 'bar',
          loadingKey: 'forecastLoading',
          dataKey: 'forecastData',
          emptyText: 'No forecast data',
          build: (c, mode) => {
            const top5 = c.forecastData.filter((p: any) => p.days_remaining !== 999).slice(0, 5);
            const labels = top5.map((p: any) => p.name?.length > 20 ? p.name.substring(0, 20) + '...' : p.name);
            const data = top5.map((p: any) => p.days_remaining);
            const colors = top5.map((p: any) => p.status === 'RED' ? '#ff4d4f' : '#faad14');
            return buildCategorical(mode, labels, data, colors, 'Top At-Risk Products',
              { legendAlways: false, indexAxis: mode === 'bar' ? 'y' : undefined });
          }
        },
        table: {
          title: 'AI Stock Forecast',
          subtitle: 'Predicted days of stock remaining',
          columns: [
            { key: 'name', label: 'Product', linkRoute: '/products' },
            { key: 'current_stock', label: 'Stock' },
            { key: 'average_sales', label: 'Daily Usage', type: 'pipe', pipeFormat: '1.1-1' },
            { key: 'days_remaining', label: 'Days Left', type: 'badge',
              badgeClass: (item) => {
                const d = item.days_remaining;
                if (d <= 0) return 'days-critical';
                if (d <= 15) return 'days-danger';
                if (d <= 30) return 'days-warning';
                return 'days-safe';
              },
              badgeLabel: (item) => item.days_remaining === 999 ? 'Safe' : item.days_remaining + 'd' },
            { key: 'status', label: 'Status', type: 'badge',
              badgeClass: (item) => ({ RED: 'ai-badge-red', YELLOW: 'ai-badge-yellow', GREEN: 'ai-badge-green' } as any)[item.status] || '' }
          ],
          dataKey: 'forecastData',
          loadingKey: 'forecastLoading',
          emptyText: 'No forecast data'
        }
      }
    ],
    extraSections: [
      {
        widgetId: 'inventory-tables',
        drawerLabel: 'Dead Stock & Demand Forecast',
        tables: [
          {
            colClass: 'col-lg-6 col-12',
            title: 'Dead Stock',
            subtitle: 'No movement for 90+ days',
            columns: [
              { key: 'product_name', label: 'Product', linkRoute: '/products' },
              { key: 'balance', label: 'Qty' },
              { key: 'dead_stock_value', label: 'Value', type: 'currency' },
              { label: 'Days Idle', type: 'custom',
                render: (item) => item.days_since_last_sale || 'Never sold' },
              { label: 'Action', type: 'custom', cellClass: 'recommendation-text',
                render: (item, ctx) => ctx.getDeadStockRecommendation(item) }
            ],
            dataKey: 'deadStockData',
            loadingKey: 'deadStockLoading',
            emptyText: 'No dead stock'
          },
          {
            colClass: 'col-lg-6 col-12',
            title: 'Demand Forecast',
            subtitle: 'Product demand trends',
            columns: [
              { key: 'name', label: 'Product', linkRoute: '/products' },
              { key: 'current_stock', label: 'Current Stock', type: 'pipe', pipeFormat: '1.0-0' },
              { key: 'avg_monthly_sales', label: 'Avg Monthly Sales', type: 'pipe', pipeFormat: '1.0-0' },
              { key: 'risk', label: 'Action', type: 'badge',
                badgeClass: (item) => ({ HIGH: 'ai-badge-red', MEDIUM: 'ai-badge-yellow', LOW: 'ai-badge-green' } as any)[item.risk] || '',
                badgeLabel: (item) => item.risk === 'HIGH' ? 'Raise PO' : item.risk === 'MEDIUM' ? 'Monitor' : 'No action' }
            ],
            dataKey: 'demandForecastData',
            loadingKey: 'demandForecastLoading',
            emptyText: 'No forecast data'
          }
        ]
      }
    ]
  },

  // ────────────────────────────────────────────────
  // PURCHASE TAB
  // ────────────────────────────────────────────────
  {
    key: 'purchase',
    label: 'Purchase',
    insightKey: 'purchaseInsight',
    cards: [
      {
        colClass: 'col-md-4 col-6',
        title: 'Auto Purchase Orders',
        indicatorClass: () => 'indicator-yellow',
        value: (c) => c.purchaseOrderSummary.total_products_to_reorder,
        subtitle: (c) => 'Est: ' + c.formatCurrency(c.purchaseOrderSummary.total_estimated_cost)
      },
      {
        colClass: 'col-md-4 col-6',
        title: 'Price Overspend',
        indicatorClass: (c) => c.priceVarianceSummary.total_overspend > 0 ? 'indicator-red' : 'indicator-green',
        value: (c) => c.formatCurrency(c.priceVarianceSummary.total_overspend),
        subtitle: (c) => c.priceVarianceSummary.overspend_items + ' item(s)'
      },
      {
        colClass: 'col-md-4 col-12',
        title: 'Vendors Scored',
        indicatorClass: () => 'indicator-green',
        value: (c) => c.bestVendorSummary.total_vendors_scored,
        subtitle: (c) => c.bestVendorSummary.total_products_analyzed + ' products'
      }
    ],
    reports: [
      {
        widgetId: 'purchase-report1',
        drawerLabel: 'PO Suggestions (Chart + Table)',
        isFirst: true,
        chart: {
          id: 'purchase',
          modes: [{ value: 'bar', label: 'Bar' }, { value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }],
          defaultMode: 'bar',
          loadingKey: 'purchaseOrderLoading',
          dataKey: 'purchaseOrderData',
          emptyText: 'No PO data',
          build: (c, mode) => {
            const items = c.purchaseOrderData.slice(0, 8);
            const labels = items.map((i: any) => i.product_name?.length > 20 ? i.product_name.substring(0, 20) + '...' : i.product_name);
            const data = items.map((i: any) => i.reorder_qty * (i.latest_rate || 1));
            const palette = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#13c2c2', '#722ed1', '#eb2f96', '#fa8c16'];
            return buildCategorical(mode, labels, data, palette, 'Purchase Order Cost by Product', { legendAlways: false, tooltipCurrency: true });
          }
        },
        table: {
          title: 'AI Purchase Order Suggestions',
          subtitle: 'One-click PO generation with best vendors',
          columns: [
            { key: 'product_name', label: 'Product', linkRoute: '/products' },
            { key: 'best_vendor_name', label: 'Vendor', linkRoute: '/vendors' },
            { key: 'reorder_qty', label: 'Qty' },
            { key: 'latest_rate', label: 'Rate', type: 'currency' },
            { label: 'Total', type: 'custom',
              render: (item, ctx) => ctx.formatCurrency(item.reorder_qty * item.latest_rate) },
            { label: '', type: 'action',
              actionText: (ctx) => ctx.purchaseOrderCreating ? 'Creating...' : 'Create PO',
              actionDisabled: (ctx) => ctx.purchaseOrderCreating,
              actionHandler: 'createPurchaseOrder' }
          ],
          dataKey: 'purchaseOrderData',
          loadingKey: 'purchaseOrderLoading',
          emptyText: 'No PO suggestions'
        }
      },
      {
        widgetId: 'purchase-report2',
        drawerLabel: 'Best Vendors (Chart + Table)',
        isFirst: false,
        chart: {
          id: 'vendorScore',
          modes: [{ value: 'bar', label: 'Bar' }, { value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }],
          defaultMode: 'bar',
          loadingKey: 'bestVendorLoading',
          dataKey: 'bestVendorData',
          emptyText: 'No vendor data',
          build: (c, mode) => {
            const type = mode as any;
            const isCircular = type === 'doughnut' || type === 'pie';
            const items = c.bestVendorData.slice(0, 8);
            const labels = items.map((i: any) => i.product_name?.length > 20 ? i.product_name.substring(0, 20) + '...' : i.product_name);
            const data = items.map((i: any) => { const bv = c.getBestVendor(i); return bv.total_score ? Math.round(bv.total_score) : 0; });
            const colors = isCircular ? ['#52c41a', '#1890ff', '#faad14', '#ff4d4f', '#13c2c2', '#722ed1', '#eb2f96', '#fa8c16']
              : data.map((s: number) => s >= 80 ? '#52c41a' : s >= 60 ? '#1890ff' : '#faad14');
            return buildCategorical(mode, labels, data, colors, 'Vendor Score by Product', { legendAlways: false, tooltipPercent: true, yMax: 100 });
          }
        },
        table: {
          title: 'Best Vendors',
          subtitle: 'AI-ranked vendor scores',
          columns: [
            { key: 'product_name', label: 'Product', linkRoute: '/products' },
            { label: 'Best Vendor', type: 'custom',
              render: (item, ctx) => ctx.getBestVendor(item).vendor_name || '—' },
            { label: 'Avg Rate', type: 'custom',
              render: (item, ctx) => ctx.formatCurrency(ctx.getBestVendor(item).avg_rate || 0) },
            { label: 'Score', type: 'badge',
              badgeClass: () => 'ai-badge-green',
              badgeLabel: (item, ctx) => {
                const bv = ctx ? ctx.getBestVendor(item) : (item.vendors?.find((v: any) => v.is_best) || item.vendors?.[0] || {});
                return (bv.total_score ? Math.round(bv.total_score) : 0) + '%';
              } }
          ],
          dataKey: 'bestVendorData',
          loadingKey: 'bestVendorLoading',
          emptyText: 'No vendor data'
        }
      },
      {
        widgetId: 'purchase-report3',
        drawerLabel: 'Price Variance (Chart + Table)',
        chart: {
          id: 'priceCompare',
          modes: [{ value: 'bar', label: 'Bar' }, { value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }],
          defaultMode: 'bar',
          loadingKey: 'priceVarianceLoading',
          dataKey: 'priceVarianceData',
          emptyText: 'No price data',
          build: (c, mode) => {
            const type = mode as any;
            const isCircular = type === 'doughnut' || type === 'pie';
            const items = c.priceVarianceData.slice(0, 8);
            const labels = items.map((i: any) => i.product_name?.length > 20 ? i.product_name.substring(0, 20) + '...' : i.product_name);
            if (isCircular) {
              const data = items.map((i: any) => i.overspend || 0);
              return {
                type,
                data: { labels, datasets: [{ label: 'Overspend', data, backgroundColor: ['#ff4d4f', '#faad14', '#1890ff', '#52c41a', '#13c2c2', '#722ed1', '#eb2f96', '#fa8c16'], borderWidth: 2, borderColor: '#fff' }] },
                options: {
                  responsive: true, maintainAspectRatio: true, aspectRatio: 1,
                  ...(type === 'doughnut' ? { cutout: '65%' } : {}),
                  plugins: {
                    legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 10, usePointStyle: true } },
                    title: { display: true, text: 'Price Overspend by Product', color: '#2c2e35', font: { size: 14, weight: 'bold' } },
                    tooltip: { callbacks: { label: (tc: any) => tc.label + ': ' + fmtCur(tc.raw) } }
                  }
                }
              };
            }
            return {
              type: 'bar',
              data: {
                labels,
                datasets: [
                  { label: 'Avg Rate', data: items.map((i: any) => i.avg_rate || 0), backgroundColor: '#faad14', borderRadius: 4, barPercentage: 0.5 },
                  { label: 'Best Rate', data: items.map((i: any) => i.best_rate || 0), backgroundColor: '#52c41a', borderRadius: 4, barPercentage: 0.5 }
                ]
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#555', maxRotation: 45 } },
                  y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#555', callback: (v: any) => fmtCur(v) } }
                },
                plugins: {
                  legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 10, usePointStyle: true } },
                  title: { display: true, text: 'Avg Rate vs Best Rate', color: '#2c2e35', font: { size: 14, weight: 'bold' } },
                  tooltip: { callbacks: { label: (tc: any) => tc.dataset.label + ': ' + fmtCur(tc.raw) } }
                }
              }
            };
          }
        },
        table: {
          title: 'Price Variance',
          subtitle: 'Cross-vendor price comparison',
          columns: [
            { key: 'product_name', label: 'Product', linkRoute: '/products' },
            { key: 'vendor_name', label: 'Vendor', linkRoute: '/vendors' },
            { key: 'avg_rate', label: 'Avg Rate', type: 'currency' },
            { key: 'best_rate', label: 'Best Rate', type: 'currency', cellClass: 'text-success-val' },
            { key: 'overspend', label: 'Overspend', type: 'custom',
              cellClass: (item) => item.overspend > 0 ? 'text-danger' : '',
              render: (item, ctx) => item.overspend > 0 ? ctx.formatCurrency(item.overspend) : '---' }
          ],
          dataKey: 'priceVarianceData',
          loadingKey: 'priceVarianceLoading',
          emptyText: 'No price data'
        }
      }
    ]
  },

  // ────────────────────────────────────────────────
  // PRODUCTION TAB
  // ────────────────────────────────────────────────
  {
    key: 'production',
    label: 'Production',
    insightKey: 'productionInsight',
    cards: [
      {
        colClass: 'col-md col-6',
        title: 'Total Suggestions',
        indicatorClass: (c) => c.workOrderSummary.total_suggestions > 0 ? 'indicator-yellow' : 'indicator-green',
        value: (c) => c.workOrderSummary.total_suggestions,
        subtitle: () => 'Products need manufacturing'
      },
      {
        colClass: 'col-md col-6',
        title: 'Ready to Produce',
        indicatorClass: (c) => c.workOrderSummary.ready_to_produce > 0 ? 'indicator-green' : 'indicator-yellow',
        value: (c) => c.workOrderSummary.ready_to_produce,
        subtitle: () => 'Materials available'
      },
      {
        colClass: 'col-md col-6',
        title: 'Blocked',
        indicatorClass: (c) => c.workOrderSummary.blocked_by_materials > 0 ? 'indicator-red' : 'indicator-green',
        value: (c) => c.workOrderSummary.blocked_by_materials,
        subtitle: () => 'Insufficient materials'
      },
      {
        colClass: 'col-md col-6',
        title: 'Raw Materials',
        indicatorClass: (c) => c.rawMaterialSummary.critical_count > 0 ? 'indicator-red' : c.rawMaterialSummary.warning_count > 0 ? 'indicator-yellow' : 'indicator-green',
        value: (c) => c.rawMaterialSummary.total_raw_materials,
        subtitle: (c) => c.rawMaterialSummary.critical_count + ' critical, ' + c.rawMaterialSummary.warning_count + ' warning'
      },
      {
        colClass: 'col-md col-6',
        title: 'Growth Ready?',
        indicatorClass: (c) => !c.whatIfSummary.can_handle_growth ? 'indicator-red' : 'indicator-green',
        value: (c) => c.whatIfSummary.can_handle_growth ? 'Yes' : 'No',
        subtitle: (c) => c.whatIfSummary.materials_short + ' short at ' + c.whatIfSummary.growth_pct + '% growth'
      }
    ],
    reports: [
      {
        widgetId: 'production-report1',
        drawerLabel: 'Work Orders (Chart + Table)',
        isFirst: true,
        chart: {
          id: 'production',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'workOrderLoading',
          emptyText: 'No production data',
          build: (c, mode) => {
            const ready = c.workOrderSummary.ready_to_produce || 0;
            const blocked = c.workOrderSummary.blocked_by_materials || 0;
            return buildCategorical(mode, ['Ready to Produce', 'Blocked by Materials'], [ready, blocked], ['#52c41a', '#ff4d4f'], 'Production Readiness', { yStep: 1 });
          }
        },
        table: {
          title: 'Work Order Suggestions',
          subtitle: 'AI-recommended manufacturing orders',
          columns: [
            { key: 'product_name', label: 'Product', linkRoute: '/products' },
            { key: 'current_balance', label: 'Stock' },
            { key: 'minimum_level', label: 'Min Level' },
            { key: 'suggested_qty', label: 'Produce Qty' },
            { key: 'can_produce', label: 'Status', type: 'badge',
              badgeClass: (item) => item.can_produce ? 'ai-badge-green' : 'ai-badge-red',
              badgeLabel: (item) => item.can_produce ? 'Ready' : 'Blocked' },
            { label: '', type: 'action',
              actionText: (ctx) => ctx.workOrderCreating ? 'Creating...' : 'Create WO',
              actionDisabled: (ctx, item) => ctx.workOrderCreating || item.max_producible_qty <= 0,
              actionHandler: 'createWorkOrder' }
          ],
          dataKey: 'workOrderData',
          loadingKey: 'workOrderLoading',
          emptyText: 'No work order suggestions'
        }
      },
      {
        widgetId: 'production-report2',
        drawerLabel: 'Material Status (Chart + Table)',
        chart: {
          id: 'material',
          modes: [{ value: 'bar', label: 'Bar' }, { value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }],
          defaultMode: 'bar',
          loadingKey: 'workOrderLoading',
          dataKey: 'materialListCache',
          emptyText: 'No material data',
          build: (c, mode) => {
            const type = mode as any;
            const isCircular = type === 'doughnut' || type === 'pie';
            const items = c.materialListCache.slice(0, 8);
            const labels = items.map((m: any) => m.material?.length > 20 ? m.material.substring(0, 20) + '...' : m.material);
            if (isCircular) {
              const data = items.map((m: any) => m.shortage > 0 ? m.shortage : m.available);
              const colors = items.map((m: any) => m.sufficient ? '#52c41a' : '#ff4d4f');
              return buildCategorical(mode, labels, data, colors, 'Material Availability');
            }
            return {
              type: 'bar',
              data: {
                labels,
                datasets: [
                  { label: 'Required', data: items.map((m: any) => m.required), backgroundColor: '#faad14', borderRadius: 4, barPercentage: 0.5 },
                  { label: 'Available', data: items.map((m: any) => m.available), backgroundColor: '#52c41a', borderRadius: 4, barPercentage: 0.5 }
                ]
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#555', maxRotation: 45 } },
                  y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#555' } }
                },
                plugins: {
                  legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 10, usePointStyle: true } },
                  title: { display: true, text: 'Required vs Available', color: '#2c2e35', font: { size: 14, weight: 'bold' } }
                }
              }
            };
          }
        },
        table: {
          title: 'Material Status',
          subtitle: 'Raw material availability for production',
          columns: [
            { key: 'product', label: 'Product', linkRoute: '/products' },
            { key: 'material', label: 'Material', linkRoute: '/products' },
            { key: 'required', label: 'Required' },
            { key: 'available', label: 'Available' },
            { key: 'shortage', label: 'Shortage', type: 'custom',
              cellClass: (item) => item.shortage > 0 ? 'text-danger' : '',
              render: (item) => item.shortage > 0 ? '-' + item.shortage : '0' },
            { key: 'sufficient', label: 'Status', type: 'badge',
              badgeClass: (item) => item.sufficient ? 'ai-badge-green' : 'ai-badge-red',
              badgeLabel: (item) => item.sufficient ? 'OK' : 'Short' }
          ],
          dataKey: 'materialListCache',
          loadingKey: 'workOrderLoading',
          emptyText: 'No material data'
        }
      },
      {
        widgetId: 'production-report3',
        drawerLabel: 'Raw Material Forecast (Chart + Table)',
        chart: {
          id: 'rawMaterial',
          modes: [{ value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }, { value: 'bar', label: 'Bar' }],
          defaultMode: 'doughnut',
          loadingKey: 'rawMaterialLoading',
          dataKey: 'rawMaterialData',
          emptyText: 'No raw material data',
          build: (c, mode) => {
            const s = c.rawMaterialSummary;
            return buildCategorical(mode, ['Critical', 'Warning', 'Safe'],
              [s.critical_count, s.warning_count, s.safe_count], ['#ff4d4f', '#faad14', '#52c41a'], 'Raw Material Stock Health');
          }
        },
        table: {
          title: 'Raw Material Forecast',
          subtitle: 'Consumption-based stockout prediction',
          columns: [
            { key: 'product_name', label: 'Material', linkRoute: '/products' },
            { key: 'current_balance', label: 'Balance' },
            { key: 'avg_daily_consumption', label: 'Daily Use', type: 'pipe', pipeFormat: '1.1-1' },
            { key: 'days_remaining', label: 'Days Left', type: 'badge',
              badgeClass: (item) => {
                const d = item.days_remaining;
                if (d <= 0) return 'days-critical';
                if (d <= 15) return 'days-danger';
                if (d <= 30) return 'days-warning';
                return 'days-safe';
              },
              badgeLabel: (item) => item.days_remaining >= 999 ? 'Safe' : item.days_remaining + 'd' },
            { key: 'status', label: 'Status', type: 'badge',
              badgeClass: (item) => ({ RED: 'ai-badge-red', YELLOW: 'ai-badge-yellow', GREEN: 'ai-badge-green' } as any)[item.status] || '' }
          ],
          dataKey: 'rawMaterialData',
          loadingKey: 'rawMaterialLoading',
          emptyText: 'No raw material data'
        }
      },
      {
        widgetId: 'production-report4',
        drawerLabel: 'What-If Simulator (Chart + Table)',
        chart: {
          id: 'whatIf',
          modes: [{ value: 'bar', label: 'Bar' }, { value: 'doughnut', label: 'Doughnut' }, { value: 'pie', label: 'Pie' }],
          defaultMode: 'bar',
          loadingKey: 'whatIfLoading',
          dataKey: 'whatIfData',
          emptyText: 'No simulation data',
          build: (c, mode) => {
            const type = mode as any;
            const isCircular = type === 'doughnut' || type === 'pie';
            if (isCircular) {
              const s = c.whatIfSummary;
              return buildCategorical(mode, ['Short', 'OK'], [s.materials_short, s.materials_ok], ['#ff4d4f', '#52c41a'], 'Growth Readiness (' + s.growth_pct + '%)');
            }
            const items = c.whatIfData.slice(0, 10);
            const labels = items.map((m: any) => m.product_name?.length > 18 ? m.product_name.substring(0, 18) + '...' : m.product_name);
            return {
              type: 'bar',
              data: {
                labels,
                datasets: [
                  { label: 'Current Stock', data: items.map((m: any) => m.current_stock), backgroundColor: '#52c41a', borderRadius: 4, barPercentage: 0.5 },
                  { label: 'Total Needed', data: items.map((m: any) => m.total_needed), backgroundColor: '#faad14', borderRadius: 4, barPercentage: 0.5 },
                  { label: 'Shortfall', data: items.map((m: any) => m.shortfall), backgroundColor: '#ff4d4f', borderRadius: 4, barPercentage: 0.5 }
                ]
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#555', maxRotation: 45 } },
                  y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#555' } }
                },
                plugins: {
                  legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, padding: 10, usePointStyle: true } },
                  title: { display: true, text: 'Stock vs Demand at ' + (c.whatIfSummary.growth_pct || 20) + '% Growth', color: '#2c2e35', font: { size: 14, weight: 'bold' } }
                }
              }
            };
          }
        },
        table: {
          title: 'What-If Simulation Results',
          subtitle: 'Material readiness at projected growth',
          columns: [
            { key: 'product_name', label: 'Material', linkRoute: '/products' },
            { key: 'current_stock', label: 'Stock' },
            { key: 'total_needed', label: 'Needed' },
            { key: 'shortfall', label: 'Shortfall', type: 'custom',
              cellClass: (item) => item.shortfall > 0 ? 'text-danger' : '',
              render: (item) => item.shortfall > 0 ? '-' + item.shortfall : '0' },
            { key: 'additional_cost', label: 'Add. Cost', type: 'pipe', pipeFormat: '1.0-0' },
            { key: 'status', label: 'Status', type: 'badge',
              badgeClass: (item) => item.status === 'SHORT' ? 'ai-badge-red' : 'ai-badge-green',
              badgeLabel: (item) => item.status === 'SHORT' ? 'Short' : 'OK' }
          ],
          dataKey: 'whatIfData',
          loadingKey: 'whatIfLoading',
          emptyText: 'No simulation data'
        }
      }
    ]
  }
];
