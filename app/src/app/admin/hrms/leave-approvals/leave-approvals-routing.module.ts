import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveApprovalsComponent } from './leave-approvals.component';

const routes: Routes = [
  {
    path:"leave-approvals",
    component:LeaveApprovalsComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveApprovalsRoutingModule { }
