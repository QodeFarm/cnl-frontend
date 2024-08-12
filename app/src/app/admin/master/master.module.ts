import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { JobTypesComponent } from './job-types/job-types.component';
import { DesignationsComponent } from './designations/designations.component';
import { JobCodesComponent } from './job-codes/job-codes.component';
import { DepartmentsComponent } from './departments/departments.component';
import { ShiftsComponent } from './shifts/shifts.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { ShippingModesComponent } from './shipping-modes/shipping-modes.component';
import { ShippingCompaniesComponent } from './shipping-companies/shipping-companies.component';


@NgModule({
  declarations: [
    JobTypesComponent,
    DesignationsComponent,
    JobCodesComponent,
    DepartmentsComponent,
    ShiftsComponent,
    LeaveSettingsComponent,
    ShippingModesComponent,
    ShippingCompaniesComponent
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    MasterRoutingModule
  ]
})
export class MasterModule { }
