import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductTypesComponent } from './product-types/product-types.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductTypesComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    AdminCommmonModule
  ]
})
export class ProductsModule { }
