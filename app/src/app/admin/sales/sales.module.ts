import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';

import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { SalesListComponent } from './sales-list/sales-list.component';
import { OrderslistComponent } from './orderslist/orderslist.component';
import { SaleReturnsComponent } from './sale-returns/sale-returns.component';
import { SaleReturnsListComponent } from './sale-returns/sale-returns-list/sale-returns-list.component';
import { CustomersComponent } from '../customers/customers.component';
import { CustomersListComponent } from '../customers/customers-list/customers-list.component';
import { SaleinvoiceorderlistComponent } from './saleinvoiceorderlist/saleinvoiceorderlist.component';
import { SalesDispatchComponent } from './sales-dispatch/sales-dispatch.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { CreditNoteListComponent } from './credit-note/credit-note-list/credit-note-list.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { RouterModule } from '@angular/router';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { PurchaseComponent } from '../purchase/purchase.component';
import { PurchaseInvoiceComponent } from '../purchase/purchase-invoice/purchase-invoice.component';
import { PurchasereturnordersComponent } from '../purchase/purchasereturnorders/purchasereturnorders.component';
// import { SalesReceiptComponent } from './sales-receipt/sales-receipt.component';
// import { SalesInvoiceListComponent } from './salesinvoice/salesinvoice-list/salesinvoice-list.component';
// import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';

@NgModule({
  declarations: [
    SalesComponent,
    SaleReturnsComponent

  ],
  imports: [
    CommonModule,
    AdminCommmonModule,
    // SalesRoutingModule,
    SalesListComponent,
    OrderslistComponent,
    SaleReturnsListComponent,
    SaleinvoiceorderlistComponent,
    SalesDispatchComponent,
    CreditNoteListComponent

    
  ],
  exports:[
    SalesDispatchComponent,
    CreditNoteListComponent,
    // SalesReceiptComponent
  ]
})
export class SalesModule { }
