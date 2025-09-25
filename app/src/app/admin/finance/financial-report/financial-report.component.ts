// import { Component, ViewChild } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { TaFormConfig } from '@ta/ta-form';
// import { FinancialReportListComponent } from './financial-report-list/financial-report-list.component';
// import { CommonModule } from '@angular/common';
// import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { TaTableComponent } from '@ta/ta-table';

// @Component({
//   selector: 'app-financial-report',
//   standalone: true,
//   imports: [CommonModule, AdminCommmonModule],
//   templateUrl: './financial-report.component.html',
//   styleUrls: ['./financial-report.component.scss']
// })
// export class FinancialReportComponent {
//   @ViewChild(TaTableComponent) taTableComponent!: TaTableComponent;
// // Date range inputs
// fromDate: string = '';
// toDate: string = '';

// // Financial values
// salesInvoices = 0;
// salesCreditNotes = 0;
// salesDebitNotes = 0;

// purchaseInvoices = 0;
// generalExpenses = 0;
// salaries = 0;

// totalSales = 0;
// totalExpenses = 0;
// netProfit = 0;

// constructor(private http: HttpClient) {}

// ngOnInit() {
//   this.loadFinancialData();
// }

// loadFinancialData() {
//   const params = this.buildQueryParams();

//   // 1. Sales Invoices
//   this.http.get<any>('sales/sale_invoice_order/?summary=true' + params).subscribe(res => {
//     if (res?.data) {
//       // console.log("sale invoice : ", res.data)
//       this.salesInvoices = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
//       console.log("this.salesInvoices : ", this.salesInvoices)
//       this.calculateResults();
//     }
//   });

//   // 2. Sales Credit Notes
//   this.http.get<any>('sales/sale_credit_note/?summary=true' + params).subscribe(res => {
//     if (res?.data) {
//       this.salesCreditNotes = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
//       this.calculateResults();
//     }
//   });

//   // 3. Sales Debit Notes
//   this.http.get<any>('sales/sale_debit_note/?summary=true' + params).subscribe(res => {
//     if (res?.data) {
//       this.salesDebitNotes = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
//       this.calculateResults();
//     }
//   });

//   // 4. Purchase Invoices
//   this.http.get<any>('purchase/purchase_order/?summary=true' + params).subscribe(res => {
//     if (res?.data) {
//       this.purchaseInvoices = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
//       this.calculateResults();
//     }
//   });

//   // 5. General Expenses
//   // this.http.get<any>('accounts/general_expense/?summary=true' + params).subscribe(res => {
//   //   if (res?.data) {
//   //     this.generalExpenses = res.data.reduce((sum: number, item: any) => sum + (+item.amount || 0), 0);
//   //     this.calculateResults();
//   //   }
//   // });

//   // 6. Salaries
//   // this.http.get<any>('hrm/salary_payment/?summary=true' + params).subscribe(res => {
//   //   if (res?.data) {
//   //     this.salaries = res.data.reduce((sum: number, item: any) => sum + (+item.amount || 0), 0);
//   //     this.calculateResults();
//   //   }
//   // });
// }

// calculateResults() {
//   this.totalSales = this.salesInvoices + this.salesDebitNotes - this.salesCreditNotes;
//   this.totalExpenses = this.purchaseInvoices + this.generalExpenses + this.salaries;
//   this.netProfit = this.totalSales - this.totalExpenses;
// }

// buildQueryParams(): string {
//   let query = '';
//   if (this.fromDate) query += `&from_date=${this.fromDate}`;
//   if (this.toDate) query += `&to_date=${this.toDate}`;
//   return query;
// }

// refreshReport() {
//   this.resetValues();
//   this.loadFinancialData();
// }

// resetValues() {
//   this.salesInvoices = 0;
//   this.salesCreditNotes = 0;
//   this.salesDebitNotes = 0;
//   this.purchaseInvoices = 0;
//   this.generalExpenses = 0;
//   this.salaries = 0;
//   this.totalSales = 0;
//   this.totalExpenses = 0;
//   this.netProfit = 0;
// }
// }

import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaTableComponent } from '@ta/ta-table';
import { formatDate } from '@angular/common';

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
  selectedPeriod: string = 'today'; // default quick period

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
        this.salesInvoices = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
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
    this.http.get<any>('finance/expense_claims/?summary=true' + params).subscribe(res => {
      console.log("we are entering into the expenses...")
      if (res?.data) {
        console.log("data of expenses : ", res.data)
        this.generalExpenses = res.data.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0);
        this.calculateResults();
      }
    });

    // 6. Salaries
    this.http.get<any>('hrms/employee_salary/?summary=true' + params).subscribe(res => {
      if (res?.data) {
        this.salaries = res.data.reduce((sum: number, item: any) => sum + (+item.salary_amount || 0), 0);
        this.calculateResults();
      }
    });
  }

  calculateResults() {
    this.totalSales = this.salesInvoices + this.salesDebitNotes - this.salesCreditNotes;
    this.totalExpenses = this.purchaseInvoices + this.generalExpenses + this.salaries;
    this.netProfit = this.totalSales - this.totalExpenses;
  }

  buildQueryParams(): string {
    let startDate = '';
    let endDate = '';
    const today = new Date();

    switch (this.selectedPeriod) {
      case 'today':
        startDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
        endDate = startDate;
        break;

      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = formatDate(yesterday, 'yyyy-MM-dd', 'en-US');
        endDate = startDate;
        break;

      case 'last_week':
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        startDate = formatDate(lastWeek, 'yyyy-MM-dd', 'en-US');
        endDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
        break;

      case 'current_month':
        startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd', 'en-US');
        endDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
        break;

      case 'last_month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = formatDate(lastMonthStart, 'yyyy-MM-dd', 'en-US');
        endDate = formatDate(lastMonthEnd, 'yyyy-MM-dd', 'en-US');
        break;

      case 'last_six_months':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        startDate = formatDate(sixMonthsAgo, 'yyyy-MM-dd', 'en-US');
        endDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
        break;

      case 'current_quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = formatDate(new Date(today.getFullYear(), quarter * 3, 1), 'yyyy-MM-dd', 'en-US');
        endDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
        break;

      case 'year_to_date':
        startDate = formatDate(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd', 'en-US');
        endDate = formatDate(today, 'yyyy-MM-dd', 'en-US');
        break;
    }

    return `&created_at_after=${startDate}&created_at_before=${endDate}&page=1&limit=10`;
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
