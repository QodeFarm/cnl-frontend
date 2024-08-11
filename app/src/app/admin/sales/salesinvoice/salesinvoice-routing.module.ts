import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesInvoiceListComponent } from './salesinvoice-list/salesinvoice-list.component';

const routes: Routes = [
  {
    path: '',
    component: SalesInvoiceListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesinvoiceRoutingModule { }
