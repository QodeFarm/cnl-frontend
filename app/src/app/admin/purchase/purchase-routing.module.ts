import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseComponent } from './purchase.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseComponent,
  },
  {
    path: 'invoice',
    component: PurchaseInvoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
