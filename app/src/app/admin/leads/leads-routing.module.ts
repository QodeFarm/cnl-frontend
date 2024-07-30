import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadsComponent } from './leads.component';
import { LeadStatusesComponent } from './lead-statuses/lead-statuses.component';
import { InteractionTypesComponent } from './interaction-types/interaction-types.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsComponent,
  },
  {
    path: 'lead_statuses',
    component: LeadStatusesComponent,
  },
  {
    path: 'interaction_types',
    component: InteractionTypesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
