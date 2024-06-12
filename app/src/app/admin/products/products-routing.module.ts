import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTypesComponent } from './product-types/product-types.component';
import { ProductUniqueQuantityCodesComponent } from './product-unique-quantity-codes/product-unique-quantity-codes.component';
import { UnitOptionsComponent } from './unit-options/unit-options.component';
import { ProductDrugTypesComponent } from './product-drug-types/product-drug-types.component';
import { ProductItemTypeComponent } from './product-item-type/product-item-type.component';
import { BrandSalesmanComponent } from './brand-salesman/brand-salesman.component';
import { ProductBrandsComponent } from './product-brands/product-brands.component';

const routes: Routes = [

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
