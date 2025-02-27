import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-gst-details',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './gst-details.component.html',
  styleUrls: ['./gst-details.component.scss']
})
export class GstDetailsComponent {
  totalInvoices: number = 0;
  totalTaxCollected: number = 0;

  totalPurchases: number = 0;
  totalTaxPaid: number = 0;

  taxAmount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSalesData();
    this.fetchPurchaseData();
  }

  fetchSalesData() {
    this.http.get<any>('sales/sale_invoice_order/?summary=true&order_status=completed').subscribe(response => {
      if (response && response.data) {
        console.log
        this.totalInvoices = response.data.length; // Count total invoices
        this.totalTaxCollected = response.data.reduce((sum, item) => sum + (parseFloat(item.tax_amount) || 0), 0);
        this.calculateTaxAmount();
      }
    });
  }
  
  fetchPurchaseData() {
    this.http.get<any>('purchase/purchase_order/?summary=true').subscribe(response => {
      if (response && response.data) {
        this.totalPurchases = response.data.length; // Count total purchases
        this.totalTaxPaid = response.data.reduce((sum, item) => sum + (parseFloat(item.tax_amount) || 0), 0);
        this.calculateTaxAmount();
      }
    });
  }
  

  calculateTaxAmount() {
    this.taxAmount = this.totalTaxCollected - this.totalTaxPaid;
  }

  fileGST() {
    window.open('https://services.gst.gov.in/', '_blank');
  }

}
