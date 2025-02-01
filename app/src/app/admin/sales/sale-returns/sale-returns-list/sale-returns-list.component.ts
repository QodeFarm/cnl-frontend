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


// Method to handle "Email Sent" button click
onMailLinkClick(): void {
  console.log("We are in method ...")
  const selectedIds = this.taTableComponent.options.checkedRows;
  if (selectedIds.length === 0) {
    alert('Please select at least one sale order.');
    return;
  }

  const saleReturnId = selectedIds[0]; // Assuming only one row can be selected
  const payload = { flag: "email" };
  const url = `masters/document_generator/${saleReturnId}/sale_return/`;
  this.http.post(url, payload).subscribe(
    (response) => {
      console.log('Email sent successfully', response);
      // alert('Email sent successfully!');
      this.refreshTable();
    },
    (error) => {
      console.error('Error sending email', error);
      alert('Error sending email. Please try again.');
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
      fieldKey: 'return_reason',
      name: 'Return Reason',
      sort: true
    },
    {
      fieldKey: 'due_date',
      name: 'Due Date',
      sort: true
    },
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
      fieldKey: 'remarks',
      name: 'Remarks',
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