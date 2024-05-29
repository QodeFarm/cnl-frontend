import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendenceRoutingModule } from './attendence-routing.module';
import { AttendenceComponent } from './attendence.component';


@NgModule({
  declarations: [
    AttendenceComponent
  ],
  imports: [
    CommonModule,
    AttendenceRoutingModule
  ]
})
export class AttendenceModule { }
