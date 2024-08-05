import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SaleReturnsComponent } from './sale-returns/sale-returns.component';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent
  },
  {
    path: 'sale-returns',
    component: SaleReturnsComponent
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
