// dashboard-tiles.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SiteConfigService } from 'projects/ta-core/src/lib/services/site-config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardTilesService {
  constructor(private http: HttpClient, private siteConfigService: SiteConfigService) {}

  get baseUrl(): string {
    return this.siteConfigService.CONFIG?.baseUrl || '';
  }

  /** Sum a numeric field across a list of rows (ignoring nulls / non-numbers). */
  private sumField(rows: any[], key: string): number {
    return (rows || []).reduce((total, row) => total + (Number(row?.[key]) || 0), 0);
  }

  /** GET that degrades to an empty result on error, so one failed call
   *  doesn't break the whole dashboard (forkJoin would otherwise error out). */
  private safeGet(url: string): Observable<any> {
    return this.http.get(url).pipe(catchError(() => of({ data: [] })));
  }

  getTileData(): Observable<any> {
    // Call all sources in parallel. Each is fault-tolerant via safeGet().
    return forkJoin({
      sales:        this.safeGet(`${this.baseUrl}dashboard/Compare_weekly_sales_and_growth/`),
      purchase:     this.safeGet(`${this.baseUrl}dashboard/Compare_weekly_purchase_and_growth/`),
      receivables:  this.safeGet(`${this.baseUrl}sales/sale_order/?outstanding_sales_by_customer=true`),
      payables:     this.safeGet(`${this.baseUrl}purchase/purchase_order/?outstanding_purchases=true`),
      bankAccounts: this.safeGet(`${this.baseUrl}finance/bank_accounts/`),
    }).pipe(
      map((responses: any) => {
        const tiles = [];

        // Sales tile — current week vs last week (real growth %)
        if (responses.sales?.data?.[0]) {
          tiles.push({
            id: 'sales',
            title: 'Sales',
            current_value: responses.sales.data[0].current_week_sales || 0,
            percentage_change: responses.sales.data[0].percentage_change || 0,
            modal_type: 'sales',
            trend: responses.sales.data[0].percentage_change > 0 ? 'up' : 'down'
          });
        }

        // Purchase tile — current week vs last week (real growth %)
        if (responses.purchase?.data?.[0]) {
          tiles.push({
            id: 'purchase',
            title: 'Purchase',
            current_value: responses.purchase.data[0].current_week_purchases || 0,
            percentage_change: responses.purchase.data[0].percentage_purchase_change || 0,
            modal_type: 'purchase',
            trend: responses.purchase.data[0].percentage_purchase_change > 0 ? 'up' : 'down'
          });
        }

        // Receivables — total still owed by customers (sum of pending amounts)
        tiles.push({
          id: 'receivables',
          title: 'Receivables',
          current_value: this.sumField(responses.receivables?.data, 'total_pending'),
          percentage_change: 0,
          modal_type: 'receivables',
          trend: ''
        });

        // Payables — total still owed to vendors (sum of outstanding amounts)
        tiles.push({
          id: 'payables',
          title: 'Payables',
          current_value: this.sumField(responses.payables?.data, 'outstanding_amount'),
          percentage_change: 0,
          modal_type: 'payables',
          trend: ''
        });

        // Cash / Bank — total balance across all bank accounts
        tiles.push({
          id: 'cashbank',
          title: 'Cash/ Bank',
          current_value: this.sumField(responses.bankAccounts?.data, 'balance'),
          percentage_change: 0,
          modal_type: 'liquidity',
          trend: ''
        });

        return { data: tiles };
      })
    );
  }
}
