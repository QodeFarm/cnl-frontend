import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditLogsRoutingModule } from './audit-logs-routing.module';
import { AuditLogsComponent } from './audit-logs.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // AuditLogsComponent
  ],
  imports: [
    CommonModule,
    AuditLogsRoutingModule,
    AdminCommmonModule
  ]
})
export class AuditLogsModule { }
