import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    AdminCommmonModule, 
  ],
  selector: 'app-stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.scss']
})
export class StockSummaryComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 900,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: 'production/stock-summary/',
      title: 'Stock Summary',
      pkId: 'summary_id',
      pageSize: 10,
      globalSearch: {
        keys: ['product.name', 'group_name', 'category_name', 'hsn_code']
      },
      defaultSort: { key: 'product.name', value: 'ascend' },
      cols: [
        {
          fieldKey: 'product',
          name: 'Product',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.product?.name || 'N/A';
          },
        },
        {
          fieldKey: 'unit_options',
          name: 'Unit',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return row.unit_options?.unit_name || 'N/A';
          },
        },
        {
          fieldKey: 'opening_quantity',
          name: 'Opening',
          sort: true,
          cssClass: 'text-secondary fw-medium'
        },
        {
          fieldKey: 'received_quantity',
          name: 'Received',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return currentValue > 0 ? `+${currentValue}` : currentValue;
          },
          cssClass: 'text-success'
        },
        {
          fieldKey: 'issued_quantity',
          name: 'Issued',
          sort: true,
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            return currentValue > 0 ? `-${currentValue}` : currentValue;
          },
          cssClass: 'text-danger'
        },
        {
          fieldKey: 'closing_quantity',
          name: 'Closing',
          sort: true,
          cssClass: 'fw-bold'
        },
        {
          fieldKey: 'trend',
          name: 'Trend',
          displayType: 'map',
          mapFn: (currentValue: any, row: any, col: any) => {
            const change = row.closing_quantity - row.opening_quantity;
            if (change > 0) return '<i class="trend-up">↑</i>';
            if (change < 0) return '<i class="trend-down">↓</i>';
            return '<i class="trend-neutral">−</i>';
          },
          displayAsHtml: true
        },
        {
          fieldKey: 'period_start',
          name: 'Period Start',
          type: 'date'
        },
        {
          fieldKey: 'period_end',
          name: 'Period End',
          type: 'date'
        },
        {
          fieldKey: 'created_at',
          name: 'Created At',
          type: 'datetime',
          displayType: 'datetime'

        }
      ]
    },
    formConfig: {
      url: '',
      title: 'Stock Summary',
      pkId: 'summary_id',
      fields: [] // Read-only report, no form fields
    }
  };

}