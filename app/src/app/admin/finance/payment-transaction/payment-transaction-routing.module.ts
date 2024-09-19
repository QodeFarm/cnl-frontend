import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentTransactionComponent } from './payment-transaction.component';

const routes: Routes = [
  {
    path:'',
    component:PaymentTransactionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentTransactionRoutingModule { }
