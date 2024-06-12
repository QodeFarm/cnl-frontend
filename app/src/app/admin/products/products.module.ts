import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductTypesComponent } from './product-types/product-types.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductUniqueQuantityCodesComponent } from './product-unique-quantity-codes/product-unique-quantity-codes.component';
import { UnitOptionsComponent } from './unit-options/unit-options.component';
import { ProductDrugTypesComponent } from './product-drug-types/product-drug-types.component';
import { ProductItemTypeComponent } from './product-item-type/product-item-type.component';
import { BrandSalesmanComponent } from './brand-salesman/brand-salesman.component';
import { ProductBrandsComponent } from './product-brands/product-brands.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductTypesComponent,
    ProductUniqueQuantityCodesComponent,
    UnitOptionsComponent,
    ProductDrugTypesComponent,
    ProductItemTypeComponent,
    BrandSalesmanComponent,
    ProductBrandsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    AdminCommmonModule
  ]
})
export class ProductsModule { }
