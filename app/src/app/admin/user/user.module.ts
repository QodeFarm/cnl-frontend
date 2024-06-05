import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { RoleComponent } from './role/role.component';


@NgModule({
  declarations: [
    UserComponent,
    RoleComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    AdminCommmonModule
  ]
})
export class UserModule { }
