import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomfieldsRoutingModule } from './customfields-routing.module';
import { CustomfieldsComponent } from './customfields.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { CustomfieldsListComponent } from './customfields-list/customfields-list.component';


@NgModule({
  declarations: [
    CustomfieldsComponent,
  ],
  imports: [
    AdminCommmonModule,
    CommonModule,
    CustomfieldsRoutingModule,
    CustomfieldsListComponent,
    CustomfieldsRoutingModule
  ]
})
export class CustomfieldsModule { }
