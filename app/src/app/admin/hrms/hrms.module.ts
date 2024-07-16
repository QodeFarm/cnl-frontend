import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmsRoutingModule } from './hrms-routing.module';
import { HrmsComponent } from './hrms.component';


@NgModule({
  declarations: [
    HrmsComponent
  ],
  imports: [
    CommonModule,
    HrmsRoutingModule
  ]
})
export class HrmsModule { }
