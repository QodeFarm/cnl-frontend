import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialReportRoutingModule } from './financial-report-routing.module';
import { FinancialReportComponent } from './financial-report.component';
import { FinancialReportListComponent } from './financial-report-list/financial-report-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // FinancialReportComponent,
    // FinancialReportListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    FinancialReportRoutingModule
  ]
})
export class FinancialReportModule { }
