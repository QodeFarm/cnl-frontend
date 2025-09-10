import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { MaterialListComponent } from './material-list/material-list.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule,AdminCommmonModule, ],
  selector: 'app-stockjournal',
  templateUrl: './stockjournal.component.html',
  styleUrls: ['./stockjournal.component.scss']
})

export class StockJournalComponent {
  curdConfig: TaCurdConfig = {
    drawerSize: 600,
    drawerPlacement: 'top',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: 'production/stock_journal/',
      title: 'Stock Journal',
      pkId: "journal_id",
      pageSize: 10,
      globalSearch: {
        keys: ['product', 'transaction_type', 'quantity', 'remarks']
      },
      export: {downloadName: 'StockJournal'},
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
         {
          fieldKey: 'product',
          name: 'Product',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
        },
        {
          fieldKey: 'direction',
          name: 'Inward/Outward',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            const type = row.transaction_type?.toLowerCase();
            if (type?.includes('receive')) return 'Inward';
            if (type?.includes('issue')) return 'Outward';
            return '';
          }
        },
        {
          fieldKey: 'transaction_type',
          name: 'Transaction Type',
          sort: true,
          displayType: "map",
          mapFn: (val: any) => {
            if (val === 'Issue-Edit') return 'Issue (Edited)';
            if (val === 'Receive-Edit') return 'Receive (Edited)';
            return val;
          }
        },
        {
          fieldKey: 'quantity',
          name: 'Quantity',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            let sign = '';
            let color = '';
            if (row.transaction_type?.toLowerCase().includes('issue')) {
              sign = '-';
              color = 'red';
            } else if (row.transaction_type?.toLowerCase().includes('receive')) {
              sign = '+';
              color = 'green';
            }
            return `<span style="color:${color}">${sign}${row.quantity}</span>`;
          }
        },
        // Add to your tableConfig.cols array
        // {
        //   fieldKey: 'closing_balance',
        //   name: 'Balance',
        //   sort: true,
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     // Calculate running balance - you'll need to implement this logic
        //     return row.balance || 'N/A';
        //   }
        // },
        {
          fieldKey: 'remarks',
          name: 'Remarks',
          sort: false
        },
        {
          fieldKey: 'created_at',
          name: 'Created At',
          type: 'date',
          sort: true,
          displayType: 'datetime'
        },
        // {
        //   fieldKey: 'journal_id',
        //   name: 'Action',
        //   type: 'action',
        //   actions: [
        //     {
        //       type: 'delete',
        //       label: 'Delete',
        //       confirm: true,
        //       confirmMsg: "Sure to delete this journal entry?",
        //       apiUrl: 'production/stock_journal'
        //     },
        //     {
        //       type: 'edit',
        //       label: 'Edit'
        //     }
        //   ]
        // }
      ]
    },
    formConfig: {
      url: 'production/stock_journal/',
      title: 'Stock Journal',
      pkId: "journal_id",
      fields: [
        {
          className: 'col-12 p-0',
          fieldGroupClassName: "ant-row",
          fieldGroup: [
            {
              key: 'product_id',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Product',
                placeholder: 'Select Product',
                required: true,
                options: [] // TODO: populate dynamically via products API
              }
            },
            {
              key: 'transaction_type',
              type: 'select',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Transaction Type',
                required: true,
                options: [
                  { label: 'Issue', value: 'issue' },
                  { label: 'Receipt', value: 'receipt' },
                  { label: 'Transfer', value: 'transfer' }
                ]
              }
            },
            {
              key: 'quantity',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                type: 'number',
                label: 'Quantity',
                placeholder: 'Enter Quantity',
                required: true,
              }
            },
            {
              key: 'reference_id',
              type: 'input',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Reference ID',
                placeholder: 'Enter Reference ID'
              }
            },
            {
              key: 'remarks',
              type: 'textarea',
              className: 'col-12 pb-3 px-1',
              templateOptions: {
                label: 'Remarks',
                placeholder: 'Enter Remarks'
              }
            },
            {
              key: 'is_deleted',
              type: 'checkbox',
              className: 'col-md-6 col-12 pb-3 px-1',
              templateOptions: {
                label: 'Is Deleted'
              }
            }
          ]
        }
      ]
    }
  };
}
