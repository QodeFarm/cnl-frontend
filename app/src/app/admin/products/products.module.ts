import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductTypesComponent } from './product-types/product-types.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductStockUnitsComponent } from './product-stock-units/product-stock-units.component';
import { ProductGstClassificationsComponent } from './product-gst-classifications/product-gst-classifications.component';
import { ProductSalesGlComponent } from './product-sales-gl/product-sales-gl.component';
import { ProductPurchaseGlComponent } from './product-purchase-gl/product-purchase-gl.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductTypesComponent,
    ProductGroupsComponent,
    ProductCategoriesComponent,
    ProductStockUnitsComponent,
    ProductGstClassificationsComponent,
    ProductSalesGlComponent,
    ProductPurchaseGlComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    AdminCommmonModule
  ]
})
export class ProductsModule { }
