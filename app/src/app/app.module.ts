import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DefaultInterceptor, TaCoreModule, HttpErrorInterceptor, GlobalErrorHandlerService, SiteConfigService, TaActionService } from '@ta/ta-core';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { RouterModule } from '@angular/router';
import { SalesComponent } from './admin/sales/sales.component';
import { SalesinvoiceComponent } from './admin/sales/salesinvoice/salesinvoice.component';
import { SaleReturnsComponent } from './admin/sales/sale-returns/sale-returns.component';
import { PurchaseComponent } from './admin/purchase/purchase.component';
import { PurchaseInvoiceComponent } from './admin/purchase/purchase-invoice/purchase-invoice.component';
import { PurchasereturnordersComponent } from './admin/purchase/purchasereturnorders/purchasereturnorders.component';
registerLocaleData(en);
export function initialConfigLoad(siteS: SiteConfigService) {
  return () => siteS.loadConfig();
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    FormlyModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot([
      // Define your routes here
      { path: 'admin/sales', component: SalesComponent },
      { path: 'admin/sales/salesinvoice', component: SalesinvoiceComponent },
      { path: 'admin/sales/sale-returns', component: SaleReturnsComponent },
      { path: 'purchase', component: PurchaseComponent },
      { path: 'purchase-invoice', component: PurchaseInvoiceComponent },
      { path: 'purchase-return', component: PurchasereturnordersComponent },
    ]),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initialConfigLoad,
      deps: [SiteConfigService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    { provide: NZ_I18N, useValue: en_US },
    Location, { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
