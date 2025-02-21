import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApprovalsRoutingModule } from './leave-approvals-routing.module';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // LeaveApprovalsComponent,
    // LeaveApprovalsListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    LeaveApprovalsRoutingModule
  ]
})
export class LeaveApprovalsModule { }
