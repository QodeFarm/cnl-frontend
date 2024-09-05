import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { TaCurdModule } from '@ta/ta-curd';
import { WorkflowListComponent } from './workflow-list/workflow-list.component'; 

@NgModule({
  declarations: [
    WorkflowComponent,
  ],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    AdminCommmonModule,
    TaCurdModule,
    WorkflowListComponent
  ]
})
export class WorkflowModule { }
