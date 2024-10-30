import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTypesComponent } from './product-types/product-types.component';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductStockUnitsComponent } from './product-stock-units/product-stock-units.component';
import { ProductGstClassificationsComponent } from './product-gst-classifications/product-gst-classifications.component';
import { ProductSalesGlComponent } from './product-sales-gl/product-sales-gl.component';
import { ProductPurchaseGlComponent } from './product-purchase-gl/product-purchase-gl.component';
import { ProductsComponent } from './products.component';
import { ProductUniqueQuantityCodesComponent } from './product-unique-quantity-codes/product-unique-quantity-codes.component';
import { UnitOptionsComponent } from './unit-options/unit-options.component';
import { ProductDrugTypesComponent } from './product-drug-types/product-drug-types.component';
import { ProductItemTypeComponent } from './product-item-type/product-item-type.component';
import { BrandSalesmanComponent } from './brand-salesman/brand-salesman.component';
import { ProductBrandsComponent } from './product-brands/product-brands.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { SizeComponent } from './size/size.component';
import { ColorComponent } from './color/color.component';
import { WarehouseLocationsComponent } from './warehouse-locations/warehouse-locations.component';
import { PackageUnitsComponent } from './package-units/package-units.component';
import { GPackageUnitsComponent } from './g-package-units/g-package-units.component';

const routes: Routes = [
  {
    path : '',
    component: ProductsComponent
  },
  {
    path : 'product-groups',
    component: ProductGroupsComponent
  },
  {
    path : 'product-categories',
    component: ProductCategoriesComponent
  },
  {
    path : 'product-stock-units',
    component: ProductStockUnitsComponent
  },
  {
    path : 'product-gst-classifications',
    component: ProductGstClassificationsComponent
  },
  {
    path : 'product-sales-gl',
    component: ProductSalesGlComponent
  },
  {
    path : 'product-purchase-gl',
    component: ProductPurchaseGlComponent
  },
  {
    path : 'product-types',
    component: ProductTypesComponent
  },
  {
    path : 'product-unique-quantity-codes',
    component: ProductUniqueQuantityCodesComponent
  },
  {
    path : 'unit-options',
    component: UnitOptionsComponent
  },
  {
    path : 'product-drug-types',
    component: ProductDrugTypesComponent
  },
  {
    path : 'product-item-type',
    component: ProductItemTypeComponent
  },
  {
    path : 'brand-salesman',
    component: BrandSalesmanComponent
  },
  {
    path : 'product-brands',
    component: ProductBrandsComponent
  },
  {
    path : 'product-sizes',
    component: SizeComponent
  },
  {
    path : 'product-colors',
    component: ColorComponent
  },
  {
    path : 'warehouse-locations',
    component: WarehouseLocationsComponent
  },
  {
    path : 'package-units',
    component: PackageUnitsComponent
  },
  {
    path : 'g-package-units',
    component: GPackageUnitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
