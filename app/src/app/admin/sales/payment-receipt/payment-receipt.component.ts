import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss']
})
export class PaymentReceiptComponent {
  formConfig: any = {
    fields: [
      {
        fieldGroupClassName: 'ant-row custom-form-block px-0 mx-0',
        fieldGroup: [
          {
            key: 'date',
            type: 'date',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions:
            {
              label: 'Date',
              required: true
            }
          },
          {
            key: 'voucher_no',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Voucher No',
              required: true,
              disabled: true
            }
          },
          {
            key: 'customer',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            props: {
              label: 'Customer',
              dataKey: 'customer_id',
              dataLabel: "name",
              options: [],
              lazy: {
                url: 'customers/customers/?summary=true',
                lazyOneTime: true
              },
              required: true
            },
            // // hooks: {
            // //   onInit: (field: any) => {
            // //     field.formControl.valueChanges.subscribe(data => {
                  
            // //     });
                
            //   }
            // }
          },
          {
            key: 'email',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Email',
              placeholder: 'Enter Email'
            }
          },
          {
            key: 'cash_bank',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Cash/Bank A/c',
              options: [
                { label: 'Cash', value: 'cash' },
                { label: 'Bank', value: 'bank' }
              ],
              required: true
            }
          },
          {
            key: 'amount',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Amount',
              type: 'number',
              required: true
            }
          },
          {
            key: 'cheque_no',
            type: 'input',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Cheque No',
              placeholder: 'Enter Cheque No'
            }
          },
          {
            key: 'party_bank_ref',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Party Bank Ref.',
              options: []
            }
          },
          {
            key: 'dated',
            type: 'date',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Dated',
              required: true
            }
          },
          {
            key: 'salesman',
            type: 'select',
            className: 'col-md-4 col-sm-6 col-12',
            templateOptions: {
              label: 'Salesman',
              options: [],
              lazy: {}
            }
          },
        ]
      }
    ]
  };
  curdConfig: TaCurdConfig = {
    drawerSize: 500,
    drawerPlacement: 'right',
    hideAddBtn: true,
    tableConfig: {
      apiUrl: '',
      title: 'Payment Receipt', 
      pkId: "voucher_no",
      pageSize: 10,
      globalSearch: { keys: ['voucher_no', 'customer', 'amount'] },
      export: {downloadName: 'PaymentRecepitList'},
      defaultSort: { key: 'date', value: 'descend' },
      cols: [
        { fieldKey: 'bill_no', name: 'Bill No', sort: true },
        { fieldKey: 'bill_date', name: 'Bill Date', sort: true },
        { fieldKey: 'due_date', name: 'Due Date', sort: true },
        { fieldKey: 'debit_credit', name: 'Debit/Credit', sort: true },
        { fieldKey: 'bill_amount', name: 'Bill Amount', sort: true },
        { fieldKey: 'outstanding', name: 'Outstanding', sort: true },
        { fieldKey: 'adjust_now', name: 'Adjust Now', sort: true },
        { fieldKey: 'cash_discount', name: 'Cash Discount', sort: true },
        { fieldKey: 'net_amount', name: 'Net Amount', sort: true },
        { fieldKey: 'ref_no', name: 'Ref No', sort: true },
        { fieldKey: 'ref_date', name: 'Ref Date', sort: true },
        { fieldKey: 'bill_branch', name: 'Bill Branch', sort: true },
        { fieldKey: 'bill_subparty', name: 'Bill SubParty', sort: true },
        { fieldKey: 'taxable', name: 'Taxable', sort: true }
      ]
    },
    formConfig: this.formConfig
  };
  SaleOrderEditID: any;

  constructor(private http: HttpClient) { }

}
