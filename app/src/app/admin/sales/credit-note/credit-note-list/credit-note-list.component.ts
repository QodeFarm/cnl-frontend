// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
// import { TaTableConfig } from '@ta/ta-table';
// import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
// import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'

// @Component({
//   selector: 'app-credit-note-list',
//   standalone: true,
//   imports: [CommonModule, AdminCommmonModule],
//   templateUrl: './credit-note-list.component.html',
//   styleUrls: ['./credit-note-list.component.scss']
// })
// export class CreditNoteListComponent {
//   @Output('edit') edit = new EventEmitter<void>();
//   @Output('circle') circle = new EventEmitter<void>();
//   @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

//   refreshTable() {
//    this.taTableComponent?.refresh();
//   };

//   tableConfig: TaTableConfig = {
//     apiUrl: 'sales/sale_credit_notes/',
//     showCheckbox: true,
//     pkId: "credit_note_id",
//     pageSize: 10,
//     "globalSearch": {
//       keys: ['customer','credit_date','sale_invoice_id','credit_note_number','reason','total_amount','status_name']
//     },
//     export: {downloadName: 'CreditNoteList'},
//     defaultSort: { key: 'created_at', value: 'descend' },
//     cols: [
//       {
//         fieldKey: 'customer',
//         name: 'Customer',
//         displayType: "map",
//         mapFn: (currentValue: any, row: any, col: any) => {
//           return `${row.customer.name}`;
//         },
//         sort: true
//       },
//       {
//         fieldKey: 'sale_invoice_id',
//         name: 'Invoice',
//         displayType: "map",
//         mapFn: (currentValue: any, row: any, col: any) => {
//           return `${row.sale_invoice.invoice_no}`;
//         },
//         sort: true
//       },
//       {
//         fieldKey: 'credit_note_number',
//         name: 'Credit note no',
//         sort: true
//       },
//       {
//         fieldKey: 'credit_date',
//         name: 'Credit Date',
//         sort: true
//       },
//       {
//         fieldKey: 'reason',
//         name: 'Return Reason',
//         sort: true
//       },
//       {
//         fieldKey: 'total_amount',
//         name: 'Total Amount',
//         sort: true
//       },
//       {
//         fieldKey: 'status_name',
//         name: 'Status',
//         displayType: "map",
//         mapFn: (currentValue: any, row: any, col: any) => {
//           return `${row.order_status.status_name}`;
//         },
//         sort: true
//       },
//       {
//         fieldKey: "code",
//         name: "Action",
//         type: 'action',
//         actions: [
//           {
//             type: 'delete',
//             label: 'Delete',
//             confirm: true,
//             confirmMsg: "Sure to delete?",
//             apiUrl: 'sales/sale_credit_notes'
//           },
//           {
//             type: 'restore',
//             label: 'Restore',
//             confirm: true,
//             confirmMsg: "Sure to restore?",
//             apiUrl: 'sales/sale_credit_notes'
//           },
//           {
//             type: 'callBackFn',
//             icon: 'fa fa-pen',
//             label: '',
//             tooltip: "Edit this record",
//             callBackFn: (row, action) => {
//               console.log(row);
//               this.edit.emit(row.credit_note_id);
              
//             }
//           },
//           {
//             type: 'callBackFn',
//             icon: 'fa fa-check-circle',
//             confirm: true,
//             confirmMsg: "Sure to Approve?",
//             callBackFn: (row, action) => {
//               this.circle.emit(row.credit_note_id);
//             }
//           }
//         ]
//       }
//     ]
//   };

// constructor(private router: Router) {}
// }

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { ActivatedRoute } from '@angular/router'; // Add this import

@Component({
  selector: 'app-credit-note-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './credit-note-list.component.html',
  styleUrls: ['./credit-note-list.component.scss']
})
export class CreditNoteListComponent implements OnInit {
  
  // Add these properties
  // isCustomerPortal: boolean = false;
  customerId: string | null = null;
  @Input() isCustomerPortal: boolean = false;

  ngOnInit() {
    // Check if this is customer portal
    this.route.data.subscribe(data => {
      this.isCustomerPortal = data['customerView'] || false;
      
      if (this.isCustomerPortal) {
        // Get customer ID from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.customerId = user.id || null;
        
        console.log('Customer Portal Mode - Customer ID:', this.customerId);
        
        // Update the table config for customer view
        this.updateTableConfigForCustomer();
      }
    });
  }

  @Output('edit') edit = new EventEmitter<void>();
  @Output('circle') circle = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  refreshTable() {
   this.taTableComponent?.refresh();
  };

  // New method to update table config for customer
  updateTableConfigForCustomer() {
    // Set API URL with customer filter
    this.tableConfig.apiUrl = `sales/sale_credit_notes/?customer_id=${this.customerId}`;
    
    // Remove admin-only actions
    this.tableConfig.cols = this.tableConfig.cols.map(col => {
      if (col.name === 'Action') {
        // For customer portal, only keep view action (remove delete/restore/approve)
        col.actions = [
          {
            type: 'callBackFn',
            icon: 'fa fa-eye',
            label: '',
            tooltip: "View Credit Note",
            callBackFn: (row, action) => {
              console.log('View credit note:', row);
              this.edit.emit(row.credit_note_id);
            }
          }
        ];
      }
      return col;
    });

    // Remove export option for customers
    this.tableConfig.export = undefined;
    
    // Remove checkboxes for customers
    this.tableConfig.showCheckbox = false;
    
    // Update fixed filters
    this.tableConfig.fixedFilters = [
      { key: 'customer_id', value: this.customerId }
    ];

    console.log('Updated credit notes table config for customer:', this.tableConfig);
  }

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_credit_notes/',
    showCheckbox: true,
    pkId: "credit_note_id",
    pageSize: 10,
    "globalSearch": {
      keys: ['customer','credit_date','sale_invoice_id','credit_note_number','reason','total_amount','status_name']
    },
    export: {downloadName: 'CreditNoteList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.customer?.name || row.customer_id || '';
        },
        sort: true
      },
      {
        fieldKey: 'sale_invoice_id',
        name: 'Invoice',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.sale_invoice?.invoice_no || '';
        },
        sort: true
      },
      {
        fieldKey: 'credit_note_number',
        name: 'Credit note no',
        sort: true
      },
      {
        fieldKey: 'credit_date',
        name: 'Credit Date',
        sort: true
      },
      {
        fieldKey: 'reason',
        name: 'Return Reason',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'status_name',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return row.order_status?.status_name || '';
        },
        sort: true
      },
      {
        fieldKey: "code",
        name: "Action",
        type: 'action',
        actions: [
          {
            type: 'delete',
            label: 'Delete',
            confirm: true,
            confirmMsg: "Sure to delete?",
            apiUrl: 'sales/sale_credit_notes'
          },
          {
            type: 'restore',
            label: 'Restore',
            confirm: true,
            confirmMsg: "Sure to restore?",
            apiUrl: 'sales/sale_credit_notes'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            tooltip: "Edit this record",
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.credit_note_id);
            }
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-check-circle',
            confirm: true,
            confirmMsg: "Sure to Approve?",
            callBackFn: (row, action) => {
              this.circle.emit(row.credit_note_id);
            }
          }
        ]
      }
    ]
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute // Add this
  ) {}
}