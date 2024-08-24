import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales.component';
import { SaleReturnsComponent } from './sale-returns/sale-returns.component';
// import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { SalesinvoiceModule } from './salesinvoice/salesinvoice.module';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { CustomersComponent } from '../customers/customers.component';

const routes: Routes = [
  {
    path: '',
    data: { title: 'Sales', moduleName: "sales" },
    component: SalesComponent
  },
  {
    path: 'sale-returns',
    data: { title: 'Sales Returns', moduleName: "sales-return" },
    component: SaleReturnsComponent
  },
  {
    path: 'salesinvoice',
    data: { title: 'Sales Invoice', moduleName: "sales-invoice" },
    component: SalesinvoiceComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
