import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorsComponent } from './vendors.component';
import { VendorCategoryComponent } from './vendor-category/vendor-category.component';
import { VendorPaymentTermsComponent } from './vendor-payment-terms/vendor-payment-terms.component';
import { VendorAgentComponent } from './vendor-agent/vendor-agent.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { FirmStatusesComponent } from './firm-statuses/firm-statuses.component';
import { GstCategoriesComponent } from './gst-categories/gst-categories.component';
import { PriceCategoriesComponent } from './price-categories/price-categories.component';
import { VendorsListComponent } from './vendors-list/vendors-list.component';


@NgModule({
  declarations: [
    VendorsComponent,
    VendorCategoryComponent,
    VendorPaymentTermsComponent,
    VendorAgentComponent,
    FirmStatusesComponent,
    GstCategoriesComponent,
    PriceCategoriesComponent,
  ],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    AdminCommmonModule,
    VendorsListComponent,
  ]
})
export class VendorsModule { }
