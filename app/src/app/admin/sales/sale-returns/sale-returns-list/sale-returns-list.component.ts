import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from 'projects/ta-table/src/lib/ta-table.component'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sale-returns-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sale-returns-list.component.html',
  styleUrls: ['./sale-returns-list.component.scss']
})
export class SaleReturnsListComponent {
  //['sale_return_id', 'return_no', 'return_date', 'tax', 'return_reason', 'total_amount', 'due_date', 'tax_amount', 'customer_id', 'order_status_id', 'remarks']
  @Output('edit') edit = new EventEmitter<void>();
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;

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
    }

    const saleReturnId = selectedIds[0]; // Assuming only one row can be selected
    const payload = { flag: "email" };
    const url = `masters/document_generator/${saleReturnId}/sale_return/`;
    this.http.post(url, payload).subscribe(
      (response) => {
        this.showSuccessToast = true;
            this.toastMessage = "Mail Sent successfully"; // Set the toast message for update
            this.refreshTable();
            setTimeout(() => {
              this.showSuccessToast = false;
            }, 2000);
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
  }
  //-----------email sending links - end ----------

  tableConfig: TaTableConfig = {
    apiUrl: 'sales/sale_return_order/?summary=true',
    showCheckbox: true,
    pkId: "sale_return_id",
    fixedFilters: [
      {
        key: 'summary',
        value: 'true'
      }
    ],
    pageSize: 10,
    "globalSearch": {
      keys: ['return_date','customer','return_no','status_name','tax','return_reason','due_date','tax_amount','total_amount','remarks']
    },
    export: {downloadName: 'SaleReturnsList'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'return_date',
        name: 'Return Date',
        sort: true
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
        fieldKey: 'return_no',
        name: 'Return No',
        sort: true
      },
      {
        fieldKey: 'status_name',
        name: 'Status',
        displayType: "map",
        mapFn: (currentValue: any, row: any, col: any) => {
          return `${row.order_status.status_name}`;
        },
        sort: true
      },
      // {
      //   fieldKey: 'tax',
      //   name: 'Tax',
      //   sort: true
      // },
      {
        fieldKey: 'tax_amount',
        name: 'Tax Amount',
        sort: true
      },
      {
        fieldKey: 'total_amount',
        name: 'Total Amount',
        sort: true
      },
      {
        fieldKey: 'return_reason',
        name: 'Return Reason',
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
            apiUrl: 'sales/sale_return_order'
          },
          {
            type: 'callBackFn',
            icon: 'fa fa-pen',
            label: '',
            callBackFn: (row, action) => {
              console.log(row);
              this.edit.emit(row.sale_return_id);
            }
          }
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient) {}
  }