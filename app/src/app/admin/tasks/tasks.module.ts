import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TaskPrioritiesComponent } from './task-priorities/task-priorities.component';

import { TasksListComponent } from './tasks-list/tasks-list.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    // TasksComponent,
    TaskPrioritiesComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    TasksRoutingModule,
    TasksListComponent
  ],
  exports:[
    TaskPrioritiesComponent
  ]
})
export class TasksModule { }
