import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaFormConfig } from '@ta/ta-form';
import { FinancialReportListComponent } from './financial-report-list/financial-report-list.component';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaTableComponent } from '@ta/ta-table';

@Component({
  selector: 'app-financial-report',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.scss']
})
export class FinancialReportComponent {
  @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
// Date range inputs
fromDate: string = '';
toDate: string = '';

// Financial values
salesInvoices = 0;
salesCreditNotes = 0;
salesDebitNotes = 0;

purchaseInvoices = 0;
generalExpenses = 0;
salaries = 0;

totalSales = 0;
totalExpenses = 0;
netProfit = 0;

constructor(private http: HttpClient) {}

ngOnInit() {
  this.loadFinancialData();
}

loadFinancialData() {
  const params = this.buildQueryParams();

  // 1. Sales Invoices
  this.http.get<any>('sales/sale_invoice_order/?summary=true' + params).subscribe(res => {
    if (res?.data) {
      // console.log("sale invoice : ", res.data)
      this.salesInvoices = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
      console.log("this.salesInvoices : ", this.salesInvoices)
      this.calculateResults();
    }
  });

  // 2. Sales Credit Notes
  this.http.get<any>('sales/sale_credit_note/?summary=true' + params).subscribe(res => {
    if (res?.data) {
      this.salesCreditNotes = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
      this.calculateResults();
    }
  });

  // 3. Sales Debit Notes
  this.http.get<any>('sales/sale_debit_note/?summary=true' + params).subscribe(res => {
    if (res?.data) {
      this.salesDebitNotes = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
      this.calculateResults();
    }
  });

  // 4. Purchase Invoices
  this.http.get<any>('purchase/purchase_order/?summary=true' + params).subscribe(res => {
    if (res?.data) {
      this.purchaseInvoices = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
      this.calculateResults();
    }
  });

  // 5. General Expenses
  // this.http.get<any>('accounts/general_expense/?summary=true' + params).subscribe(res => {
  //   if (res?.data) {
  //     this.generalExpenses = res.data.reduce((sum: number, item: any) => sum + (+item.amount || 0), 0);
  //     this.calculateResults();
  //   }
  // });

  // 6. Salaries
  // this.http.get<any>('hrm/salary_payment/?summary=true' + params).subscribe(res => {
  //   if (res?.data) {
  //     this.salaries = res.data.reduce((sum: number, item: any) => sum + (+item.amount || 0), 0);
  //     this.calculateResults();
  //   }
  // });
}

calculateResults() {
  this.totalSales = this.salesInvoices + this.salesDebitNotes - this.salesCreditNotes;
  this.totalExpenses = this.purchaseInvoices + this.generalExpenses + this.salaries;
  this.netProfit = this.totalSales - this.totalExpenses;
}

buildQueryParams(): string {
  let query = '';
  if (this.fromDate) query += `&from_date=${this.fromDate}`;
  if (this.toDate) query += `&to_date=${this.toDate}`;
  return query;
}

refreshReport() {
  this.resetValues();
  this.loadFinancialData();
}

resetValues() {
  this.salesInvoices = 0;
  this.salesCreditNotes = 0;
  this.salesDebitNotes = 0;
  this.purchaseInvoices = 0;
  this.generalExpenses = 0;
  this.salaries = 0;
  this.totalSales = 0;
  this.totalExpenses = 0;
  this.netProfit = 0;
}
}