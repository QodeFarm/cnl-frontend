import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorCategoryComponent } from './vendor-category/vendor-category.component';
import { VendorPaymentTermsComponent } from './vendor-payment-terms/vendor-payment-terms.component';
import { VendorAgentComponent } from './vendor-agent/vendor-agent.component';
import { FirmStatusesComponent } from './firm-statuses/firm-statuses.component';
import { GstCategoriesComponent } from './gst-categories/gst-categories.component';
import { PriceCategoriesComponent } from './price-categories/price-categories.component';
import { VendorsComponent } from './vendors.component';
import { VendorsListComponent } from './vendors-list/vendors-list.component';

const routes: Routes = [
  {
    path : 'vendor-category',
    component: VendorCategoryComponent
  },
  {
    path : 'vendor-payment-terms',
    component: VendorPaymentTermsComponent
  },
  {
    path : 'vendor-agent',
    component: VendorAgentComponent
  },
  {
    path : 'firm-statuses',
    component: FirmStatusesComponent
  },
  {
    path : 'gst-categories',
    component: GstCategoriesComponent
  },
  {
    path : 'price-categories',
    component: PriceCategoriesComponent
  },
  {
    path : '',
    component: VendorsComponent
  },
  // {
  //   path : 'vendors/vendors_list',
  //   component: VendorsComponent
  // },
  // {
  //   path : 'vendors-list',
  //   component: VendorsListComponent
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
