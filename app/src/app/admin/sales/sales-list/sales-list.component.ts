import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableConfig } from '@ta/ta-table';
import { Router } from '@angular/router';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent {

  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

  constructor(private router: Router, private http: HttpClient) { }

  refreshTable() {
    this.taTableComponent?.refresh();
  };

  //-----------email sending links----------
  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    switch (selectedValue) {
      case 'email':
        this.onMailLinkClick();
        break;
      case 'whatsapp':
        break;
      default:
        // Handle default case (e.g., "Mail" selected)
        break;
    }

    // Reset the dropdown to the default option
    selectElement.value = '';
  }
  showDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'flex'; // Show the dialog
    }
  }

  // Function to close the custom dialog
  closeDialog() {
    const dialog = document.getElementById('customDialog');
    if (dialog) {
      dialog.style.display = 'none'; // Hide the dialog
    }
  }

  showSuccessToast = false;
  toastMessage = '';
  // Method to handle "Email Sent" button click
  onMailLinkClick(): void {
    console.log("We are in method ...")
    const selectedIds = this.taTableComponent.options.checkedRows;
    if (selectedIds.length === 0) {
      return this.showDialog();
      // return;
    }

    const saleOrderId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email" };
    const url = `masters/document_generator/${saleOrderId}/sale_order/`;
    this.http.post(url, payload).subscribe(
      (response) => {
        this.showSuccessToast = true;
        this.toastMessage = "Mail Sent successfully"; // Set the toast message for update
        this.refreshTable();
        setTimeout(() => {
          this.showSuccessToast = false;
        }, 2000);
        // alert('Email sent successfully!');

      },
      (error) => {
        console.error('Error sending email', error);
        // alert('Error sending email. Please try again.');
      }
    );
  }
  //-----------email sending links - end ----------
  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_order/?summary=true',
    // title: 'Edit Sales Order List',
    showCheckbox: true,
    pkId: "sale_order_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['order_date','order_no','sale_type','customer','sale_estimate','amount','tax','advance_amount','status_name','flow_status_name']
    },
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'order_date',
        name: 'Order Date',
        sort: true
      },
      {
        fieldKey: 'order_no',
        name: 'Order No',
        sort: true
      },
      {
        fieldKey: 'sale_type',
        name: 'Sale Type',
        sort: true,
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          // console.log("-->", currentValue);
          return `${row.sale_type?.name || ''}`;
        },
      },

      {
        fieldKey: 'customer',
        name: 'Customer',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.customer.name}`;
        },
        sort: true
      },
      {
        fieldKey: 'sale_estimate',
        name: 'Sale Estimate',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'tax',
        name: 'Tax',
        sort: true
      },
      {
        fieldKey: 'advance_amount',
        name: 'Advance Amt',
        sort: true
      },
      {
        fieldKey: 'order_status',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.order_status.status_name}`;
        },
        sort: true
      },
      {
        fieldKey: 'flow_status',
        name: 'Flow Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          if (row.flow_status)
            return `${row.flow_status.flow_status_name}`
          return '';
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
            apiUrl: 'sales/sale_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_order_id);
              // this.router.navigateByUrl('/admin/sales/edit/' + row.sale_order_id);
            }
          }
        ]
      }
    ]
  };

}
