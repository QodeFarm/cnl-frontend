// dashboard-tiles.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SiteConfigService } from 'projects/ta-core/src/lib/services/site-config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardTilesService {
  constructor(private http: HttpClient, private siteConfigService: SiteConfigService) {}

  get baseUrl(): string {
    return this.siteConfigService.CONFIG?.baseUrl || '';
  }

  getTileData(): Observable<any> {
    // Use forkJoin to call multiple APIs in parallel
    return forkJoin({
      sales: this.http.get(`${this.baseUrl}dashboard/Compare_weekly_sales_and_growth/`),
      purchase: this.http.get(`${this.baseUrl}dashboard/Compare_weekly_purchase_and_growth/`),
      receivables: this.http.get(`${this.baseUrl}sales/sale_order/?outstanding_sales_by_customer=true`),
      payables: this.http.get(`${this.baseUrl}purchase/purchase_order/?outstanding=true`),
    //   liquidity: this.http.get(`${this.baseUrl}dashboard/Liquidity_Summary/`) // Adjust if needed
    }).pipe(
      map((responses: any) => {
        // Transform the responses into tile format
        const tiles = [];
        
        // Sales tile
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
        
        // Purchase tile
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
        
        // Receivables tile - You may need to adjust based on your actual API
        tiles.push({
          id: 'receivables',
          title: 'Receivables',
          current_value: 1250000, // Example static value or from API
          percentage_change: 5.2,
          modal_type: 'receivables',
          trend: 'up'
        });
        
        // Payables tile
        tiles.push({
          id: 'payables',
          title: 'Payables',
          current_value: 980000,
          percentage_change: 3.1,
          modal_type: 'payables',
          trend: 'down'
        });
        
        // Cash/Bank tile
        tiles.push({
          id: 'cashbank',
          title: 'Cash/ Bank',
          current_value: 2150000,
          percentage_change: 2.5,
          modal_type: 'liquidity',
          trend: 'up'
        });
        
        return { data: tiles };
      })
    );
  }
}