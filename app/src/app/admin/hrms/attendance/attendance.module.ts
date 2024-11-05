import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    AttendanceComponent,
    AttendanceListComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    AttendanceRoutingModule
  ]
})
export class AttendanceModule { }
