import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTypesComponent } from './product-types/product-types.component';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { ProductStockUnitsComponent } from './product-stock-units/product-stock-units.component';
import { ProductGstClassificationsComponent } from './product-gst-classifications/product-gst-classifications.component';
import { ProductSalesGlComponent } from './product-sales-gl/product-sales-gl.component';
import { ProductPurchaseGlComponent } from './product-purchase-gl/product-purchase-gl.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { ProductsComponent } from './products.component';

const routes: Routes = [
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
    path : 'products',
    component: ProductsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
