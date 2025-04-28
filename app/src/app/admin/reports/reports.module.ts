import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SalesRepotsComponent } from './sales-reports/sales-reports.component';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { PurchaseReportsComponent } from './purchase-reports/purchase-reports.component';
import { LedgersReportsComponent } from './ledgers-reports/ledgers-reports.component';
import { LedgerAccountsComponent } from '../customers/ledger-accounts/ledger-accounts.component';
import { VendorReportsComponent } from './vendor-reports/vendor-reports.component';
import { CustomerReportsComponent } from './customer-reports/customer-reports.component';
import { ProductionReportsComponent } from './production-reports/production-reports.component';
import { GstReportsComponent } from './gst-reports/gst-reports.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    ReportsRoutingModule,
    SalesRepotsComponent,
    PurchaseReportsComponent,
    LedgersReportsComponent,
    VendorReportsComponent,
    CustomerReportsComponent,
    ProductionReportsComponent,
    GstReportsComponent

  ]
})
export class ReportsModule { }
