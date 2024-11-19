import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveApprovalsListComponent } from './leave-approvals-list/leave-approvals-list.component';

const routes: Routes = [
  {
    path:"",
    component:LeaveApprovalsListComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveApprovalsRoutingModule { }
