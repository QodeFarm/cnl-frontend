import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasereturnordersComponent } from './purchasereturnorders.component';

const routes: Routes = [
  {
    path : '',
    component : PurchasereturnordersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasereturnordersRoutingModule { }
