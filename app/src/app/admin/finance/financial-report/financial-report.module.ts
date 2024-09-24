import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialReportRoutingModule } from './financial-report-routing.module';
import { FinancialReportComponent } from './financial-report.component';
import { FinancialReportListComponent } from './financial-report-list/financial-report-list.component';


@NgModule({
  declarations: [
    FinancialReportComponent,
    FinancialReportListComponent
  ],
  imports: [
    CommonModule,
    FinancialReportRoutingModule
  ]
})
export class FinancialReportModule { }
