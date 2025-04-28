import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesRepotsComponent } from './sales-reports/sales-reports.component';
import { LedgersReportsComponent } from './ledgers-reports/ledgers-reports.component';

const routes: Routes = [
  {
      path: 'sales-reports',
      component: SalesRepotsComponent,
  },
  {
    path: 'ledgers-reports',
    component: LedgersReportsComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
