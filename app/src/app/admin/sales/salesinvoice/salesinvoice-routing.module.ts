import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesInvoiceListComponent } from './salesinvoice-list/salesinvoice-list.component';
import { SalesinvoiceComponent } from './salesinvoice.component';

const routes: Routes = [
  {
    path: 'salesinvoice',
    component: SalesinvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesinvoiceRoutingModule { }
