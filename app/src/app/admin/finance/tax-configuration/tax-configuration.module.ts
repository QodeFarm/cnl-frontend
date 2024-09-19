import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxConfigurationRoutingModule } from './tax-configuration-routing.module';
import { TaxConfigurationComponent } from './tax-configuration.component';
import { TaxConfigurationListComponent } from './tax-configuration-list/tax-configuration-list.component';


@NgModule({
  declarations: [
    TaxConfigurationComponent,
    TaxConfigurationListComponent
  ],
  imports: [
    CommonModule,
    TaxConfigurationRoutingModule
  ]
})
export class TaxConfigurationModule { }
