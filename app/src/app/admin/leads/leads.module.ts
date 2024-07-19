import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { LeadsListComponent } from './leads-list/leads-list.component';


@NgModule({
  declarations: [
    LeadsComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    LeadsRoutingModule,
    LeadsListComponent
  ]
})
export class LeadsModule { }
