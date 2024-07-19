import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmsRoutingModule } from './hrms-routing.module';
import { HrmsComponent } from './hrms.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    HrmsComponent
  ],
  imports: [
    CommonModule,
    HrmsRoutingModule,
    AdminCommmonModule
  ]
})
export class HrmsModule { }
