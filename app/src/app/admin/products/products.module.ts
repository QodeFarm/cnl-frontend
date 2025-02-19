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
import { ProductUniqueQuantityCodesComponent } from './product-unique-quantity-codes/product-unique-quantity-codes.component';
import { UnitOptionsComponent } from './unit-options/unit-options.component';
import { ProductDrugTypesComponent } from './product-drug-types/product-drug-types.component';
import { ProductItemTypeComponent } from './product-item-type/product-item-type.component';
import { BrandSalesmanComponent } from './brand-salesman/brand-salesman.component';
import { ProductBrandsComponent } from './product-brands/product-brands.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductItemBalanceComponent } from './product-item-balance/product-item-balance.component';
import { SizeComponent } from './size/size.component';
import { ColorComponent } from './color/color.component';
import { WarehouseLocationsComponent } from './warehouse-locations/warehouse-locations.component';
import { PackageUnitsComponent } from './package-units/package-units.component';
import { GPackageUnitsComponent } from './g-package-units/g-package-units.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';


@NgModule({
  declarations: [
    // ProductsComponent,
    ProductTypesComponent,
    ProductGroupsComponent,
    ProductCategoriesComponent,
    ProductStockUnitsComponent,
    ProductGstClassificationsComponent,
    ProductSalesGlComponent,
    ProductPurchaseGlComponent,
    ProductUniqueQuantityCodesComponent,
    UnitOptionsComponent,
    ProductDrugTypesComponent,
    ProductItemTypeComponent,
    BrandSalesmanComponent,
    ProductBrandsComponent,
    ProductItemBalanceComponent,
    ProductItemBalanceComponent,
    SizeComponent,
    ColorComponent,
    WarehouseLocationsComponent,
    PackageUnitsComponent,
    GPackageUnitsComponent
    // ProductsListComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    AdminCommmonModule,
    ProductsListComponent,
    NzNotificationModule
  ],
  exports: [
    // ProductsComponent,
    ProductTypesComponent,
    ProductGroupsComponent,
    ProductCategoriesComponent,
    ProductStockUnitsComponent,
    ProductGstClassificationsComponent,
    ProductSalesGlComponent,
    ProductPurchaseGlComponent,
    ProductUniqueQuantityCodesComponent,
    UnitOptionsComponent,
    ProductDrugTypesComponent,
    ProductItemTypeComponent,
    BrandSalesmanComponent,
    ProductBrandsComponent,
    ProductItemBalanceComponent,
    SizeComponent,
    ColorComponent,
    WarehouseLocationsComponent,
    PackageUnitsComponent,
    GPackageUnitsComponent
  ]
})
export class ProductsModule { }
