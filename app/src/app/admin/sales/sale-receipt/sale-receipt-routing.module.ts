import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleReceiptListComponent } from './sale-receipt-list/sale-receipt-list.component';
import { SaleReceiptComponent } from './sale-receipt.component';

const routes: Routes = [
  {
    path: '',
    component: SaleReceiptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleReceiptRoutingModule { }
