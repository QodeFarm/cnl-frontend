import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobTypesComponent } from './job-types/job-types.component';
import { DesignationsComponent } from './designations/designations.component';
import { JobCodesComponent } from './job-codes/job-codes.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';

const routes: Routes = [

  {
    path: 'job-type',
    component: JobTypesComponent
  },
  {
    path: 'designations',
    component: DesignationsComponent
  },
  {
    path: 'job-codes',
    component: JobCodesComponent
  },
  {
    path: 'departments',
    component: DepartmentsComponent
  },
  {
    path: 'shifts',
    component: ShiftsComponent
  },
  {
    path: 'leave-settings',
    component: LeaveSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
