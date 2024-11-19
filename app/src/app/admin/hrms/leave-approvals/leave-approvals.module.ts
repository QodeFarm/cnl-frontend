import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveApprovalsRoutingModule } from './leave-approvals-routing.module';
import { LeaveApprovalsComponent } from './leave-approvals.component';
import { LeaveApprovalsListComponent } from './leave-approvals-list/leave-approvals-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    LeaveApprovalsComponent,
    LeaveApprovalsListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    LeaveApprovalsRoutingModule
  ]
})
export class LeaveApprovalsModule { }
