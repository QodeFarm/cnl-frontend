import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalVoucherComponent } from './journal-voucher.component';

const routes: Routes = [
  {
    path: '',
    component: JournalVoucherComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalVoucherRoutingModule { }
