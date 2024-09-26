import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { LeadStatusesComponent } from './lead-statuses/lead-statuses.component';
import { InteractionTypesComponent } from './interaction-types/interaction-types.component';


@NgModule({
  declarations: [
    // LeadsComponent,
    LeadStatusesComponent,
    InteractionTypesComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    LeadsRoutingModule,
    LeadsListComponent
  ],
  exports:[
    LeadStatusesComponent,
    InteractionTypesComponent
  ]
})
export class LeadsModule { }
