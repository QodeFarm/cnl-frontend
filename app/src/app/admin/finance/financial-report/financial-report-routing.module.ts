import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialReportListComponent } from './financial-report-list/financial-report-list.component';

const routes: Routes = [
  {
    path:"",
    component:FinancialReportListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialReportRoutingModule { }
