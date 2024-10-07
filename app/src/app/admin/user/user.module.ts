import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { RolesComponent } from './roles/roles.component';


@NgModule({
  declarations: [
    // UserComponent,
    // RolesComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AdminCommmonModule
  ]
})
export class UserModule { }
