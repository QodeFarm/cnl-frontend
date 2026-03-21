import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from '@ta/ta-core';
import { TaTableConfig, TaTableModule } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

interface StockForecastSummary {
  total_products: number;
  critical_count: number;
  warning_count: number;
  healthy_count: number;
  period_days: number;
}

interface PeriodInfo {
  period_days: number;
  start_date: string;
  end_date: string;
  months: number;
}

@Component({
  selector: 'app-inventory-reports',
  standalone: true,
  imports: [
    CommonModule, 
    AdminCommmonModule, 
    TaTableModule,
    NzIconModule,
    NzToolTipModule
  ],
  templateUrl: './inventory-reports.component.html',
  styleUrls: ['./inventory-reports.component.scss']
})
export class InventoryReportsComponent implements OnInit {
  
  isAccordionOpen = true;
  selectedReportKey: string | null = null;
  tableConfig: TaTableConfig | null = null;
  loading: boolean = false;
  error: string | null = null;
  isSuperUser: boolean = false;
  activeStatusFilter: string = 'all';

  // Stock Forecast Summary
  summary: StockForecastSummary = {
    total_products: 0,
    critical_count: 0,
    warning_count: 0,
    healthy_count: 0,
    period_days: 30
  };
  summaryLoading: boolean = false;
  showSummary: boolean = false;

  // Period Info from API response
  periodInfo: PeriodInfo = {
    period_days: 180,
    start_date: '',
    end_date: '',
    months: 6.0
  };
  selectedPeriodLabel: string = 'Last 6 Months';

  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient,
    private router: Router,
    private modal: NzModalService,
    private message: NzMessageService
  ) {
    const user = this.localStorage.getItem('user');
    this.isSuperUser = user?.is_sp_user === true;
  }

  ngOnInit(): void {
    // Don't auto-select - user clicks the report link to see content
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  selectReport(reportKey: string) {
    this.selectedReportKey = reportKey;
    this.isAccordionOpen = false;
    
    this.showSummary = reportKey === 'stockForecast';
    if (this.showSummary) {
      this.loadSummary();
      this.loadStockForecastReport();
    }
  }

  filterByStatus(status: string): void {
    this.activeStatusFilter = status;
    this.loadStockForecastReport(status);
  }

  loadStockForecastReport(statusFilter: string = 'all'): void {
    let apiUrl = `inventory/stock_forecast_report/`;
    
    // Add status filter if not 'all'
    if (statusFilter && statusFilter !== 'all') {
      const statusMap: { [key: string]: string } = {
        'critical': 'RED',
        'warning': 'YELLOW',
        'healthy': 'GREEN'
      };
      const statusValue = statusMap[statusFilter] || statusFilter;
      apiUrl += `?status=${statusValue}`;
    }

    this.tableConfig = {
      apiUrl: apiUrl,
      pkId: 'product_id',
      pageSize: 10,
      globalSearch: {
        keys: ['name', 'code',  'product_group' , 'category', 'type', 'current_stock', 'average_sales'   , 'stock_difference', 'status']
      },
      export: { downloadName: 'StockForecastReport' },
      defaultSort: { key: 'status', value: 'ascend' },
      cols: [
        {
          fieldKey: 'name',
          name: 'Product',
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'Code',
          sort: true
        },
        {
          fieldKey: 'product_group',
          name: 'Group',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => row?.product_group?.group_name || '-'
        },
        {
          fieldKey: 'type',
          name: 'Type',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => row?.type?.type_name || '-'
        },
        {
          fieldKey: 'category',
          name: 'Category',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => row?.category?.category_name || '-'
        },
        // {
        //   fieldKey: 'warehouse',
        //   name: 'Warehouse',
        //   sort: true,
        //   displayType: 'map',
        //   mapFn: (currentValue: any, row: any) => row?.warehouse?.name || '-'
        // },
        {
          fieldKey: 'current_stock',
          name: 'Current Stock',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            const stock = parseFloat(row?.current_stock) || 0;
            return stock.toFixed(2);
          }
        },
        {
          fieldKey: 'average_sales',
          name: 'Avg Sales',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            const avgSales = parseFloat(row?.average_sales) || 0;
            return avgSales.toFixed(2);
          }
        },
        {
          fieldKey: 'stock_difference',
          name: 'Difference',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            const diff = parseFloat(row?.stock_difference) || 0;
            if (diff > 0) {
              return `<span class="text-success fw-bold">+${diff.toFixed(2)}</span>`;
            } else if (diff < 0) {
              return `<span class="text-danger fw-bold">${diff.toFixed(2)}</span>`;
            }
            return `<span class="text-muted">${diff.toFixed(2)}</span>`;
          },
          // Clean value for Excel export
          exportFn: (currentValue: any, row: any) => {
            const diff = parseFloat(row?.stock_difference) || 0;
            return diff.toFixed(2);
          }
        },
        {
          fieldKey: 'status',
          name: 'Status',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            const status = (row?.status || currentValue || '').toUpperCase();
            
            if (status === 'RED') {
              return '<span class="badge bg-danger">● Critical</span>';
            }
            if (status === 'YELLOW') {
              return '<span class="badge bg-warning text-dark">● Warning</span>';
            }
            if (status === 'GREEN') {
              return '<span class="badge bg-success">● Healthy</span>';
            }
            return status || '-';
          },
          // Clean value for Excel export
          exportFn: (currentValue: any, row: any) => {
            const status = (row?.status || currentValue || '').toUpperCase();
            if (status === 'RED') return 'Critical';
            if (status === 'YELLOW') return 'Warning';
            if (status === 'GREEN') return 'Healthy';
            return status || '-';
          }
        },
        {
          fieldKey: 'actions',
          name: 'Action',
          type: 'action',
          actions: [
            {
              type: 'callBackFn',
              displayType: 'map',
              mapFn: (row: any) => row?.action_label || 'Request',
              label: 'Request',
              callBackFn: (row: any, action: any) => {
                const actionLabel = (row?.action_label || 'Request').toLowerCase();
                if (actionLabel === 'request') {
                  this.openWorkOrder(row);
                  return;
                }
                this.viewProduct(row);
              }
            }
          ]
        }
      ]
    };
  }

  loadSummary(): void {
    this.summaryLoading = true;
    
    // Call the main API with summary=true to get summary data
    this.http.get<any>(`inventory/stock_forecast_report/?summary=true`).subscribe(
      (response) => {
        console.log('Stock Forecast API Response:', response);
        
        // Try to get summary from different possible locations
        const summary = response?.summary || response?.data?.summary || {};
        
        this.summary = {
          total_products: summary?.total_products ?? response?.totalCount ?? response?.count ?? 0,
          critical_count: summary?.red_count ?? summary?.critical_count ?? 0,
          warning_count: summary?.yellow_count ?? summary?.warning_count ?? 0,
          healthy_count: summary?.green_count ?? summary?.healthy_count ?? 0,
          period_days: summary?.period_days ?? 180
        };
        
        // Get period info from response
        if (response?.period_info) {
          this.periodInfo = {
            period_days: response.period_info.period_days || 180,
            start_date: response.period_info.start_date || '',
            end_date: response.period_info.end_date || '',
            months: response.period_info.months || 6.0
          };
          this.selectedPeriodLabel = this.getPeriodLabel(this.periodInfo.period_days);
        }
        
        console.log('Parsed Summary:', this.summary);
        console.log('Period Info:', this.periodInfo);
        this.summaryLoading = false;
      },
      (error) => {
        console.error('Error loading summary:', error);
        this.summaryLoading = false;
      }
    );
  }

  // Get human readable period label from period_days
  getPeriodLabel(periodDays: number): string {
    const periodLabels: { [key: number]: string } = {
      1: 'Today',
      7: 'Last Week',
      30: 'Last Month',
      90: 'Current Quarter',
      180: 'Last 6 Months',
      365: 'Last Year'
    };
    return periodLabels[periodDays] || `Last ${periodDays} Days`;
  }

  // Format date for display (e.g., "Jul 6, 2025")
  formatDisplayDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  openWorkOrder(row: any): void {
    const productId = row?.product_id || row?.id;
    const currentStock = parseFloat(row?.current_stock) || 0;
    const avgSales = parseFloat(row?.average_sales) || 0;
    const suggestedQty = Math.max(0, Math.ceil(Math.abs(parseFloat(row?.stock_difference) || (avgSales - currentStock))));

    // Navigate to Work Order creation page with pre-filled data via state
    // The WorkorderComponent reads from history.state.productDetails
    this.router.navigate(['/admin/production'], {
      state: {
        productDetails: [{
          product_id: productId,
          quantity: suggestedQty
        }]
      }
    });
  }

  private escapeHtml(text: string): string {
    const el = document.createElement('span');
    el.textContent = text;
    return el.innerHTML;
  }

  viewProduct(row: any): void {
    const productName = this.escapeHtml(row?.name || 'Product');
    const productCode = this.escapeHtml(row?.code || '-');
    const categoryName = this.escapeHtml(row?.category?.category_name || '-');
    const groupName = this.escapeHtml(row?.product_group?.group_name || '-');
    const warehouseName = this.escapeHtml(row?.warehouse?.name || '-');
    const currentStock = parseFloat(row?.current_stock) || 0;
    const avgSales = parseFloat(row?.average_sales) || 0;
    const difference = parseFloat(row?.stock_difference) || (currentStock - avgSales);
    const status = row?.status || '';
    const statusMessage = this.escapeHtml(row?.status_message || '');
    const recommendedAction = this.escapeHtml(row?.recommended_action || '');

    const statusMap: Record<string, { cls: string; label: string }> = {
      'RED': { cls: 'status-critical', label: 'Critical' },
      'YELLOW': { cls: 'status-warning', label: 'Warning' },
      'GREEN': { cls: 'status-healthy', label: 'Healthy' },
    };
    const { cls: statusClass, label: statusLabel } = statusMap[status] || { cls: 'status-unknown', label: 'Unknown' };

    // Show product details in a modal
    this.modal.info({
      nzTitle: `Product Details - ${productName}`,
      nzContent: `
        <div class="forecast-modal-content">
          <div class="forecast-grid">
            <div class="forecast-row"><span class="label">Product Name</span><span class="value">${productName}</span></div>
            <div class="forecast-row"><span class="label">Product Code</span><span class="value">${productCode}</span></div>
            <div class="forecast-row"><span class="label">Category</span><span class="value">${categoryName}</span></div>
            <div class="forecast-row"><span class="label">Product Group</span><span class="value">${groupName}</span></div>
            <div class="forecast-row"><span class="label">Warehouse</span><span class="value">${warehouseName}</span></div>
          </div>
          <div class="forecast-divider"></div>
          <div class="forecast-grid">
            <div class="forecast-row"><span class="label">Current Stock</span><span class="value">${currentStock.toFixed(2)}</span></div>
            <div class="forecast-row"><span class="label">Avg Sales</span><span class="value">${avgSales.toFixed(2)}</span></div>
            <div class="forecast-row"><span class="label">Difference</span><span class="value ${difference >= 0 ? 'positive' : 'negative'}">${difference >= 0 ? '+' : ''}${difference.toFixed(2)}</span></div>
            <div class="forecast-row"><span class="label">Status</span><span class="status-pill ${statusClass}">${statusLabel}</span></div>
            ${statusMessage ? `<div class="forecast-row"><span class="label">Message</span><span class="value">${statusMessage}</span></div>` : ''}
            ${recommendedAction ? `<div class="forecast-row"><span class="label">Recommended Action</span><span class="value">${recommendedAction}</span></div>` : ''}
          </div>
        </div>
      `,
      nzOkText: 'Close',
      nzWidth: 560,
      nzClassName: 'forecast-detail-modal'
    });
  }
}
