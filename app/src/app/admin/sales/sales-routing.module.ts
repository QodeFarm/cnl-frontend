import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SalesinvoiceModule } from './salesinvoice/salesinvoice.module';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent
  },
  {
    path: 'salesinvoice',
    component: SalesinvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
