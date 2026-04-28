// customer-portal/services/customer-portal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerPortalService {
  
  constructor(private http: HttpClient) {}

  // Get customer ID from localStorage
  private getCustomerId(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || null;
  }

  // ========== FORGOT PASSWORD METHODS ==========
  
   // Forgot password - request reset link
  forgotPassword(username: string): Observable<any> {
    return this.http.post(`customers/portal/forgot-password/`, { username });
  }
  
  // ✅ Add this method to validate token
  validateResetToken(token: string): Observable<any> {
    return this.http.post(`customers/portal/validate-token/`, { token });
  }
  
  // Reset password
  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`customers/portal/reset-password/${token}/`, {
      new_password: newPassword,
      confirm_password: confirmPassword
    });
  }

  // Sales Orders - Filtered by customer
  getSalesOrders(): Observable<any> {
    const customerId = this.getCustomerId();
    return this.http.get(`customers/portal/sales-orders/?customer_id=${customerId}`);
  }

  // Invoices - Filtered by customer
  getInvoices(): Observable<any> {
    const customerId = this.getCustomerId();
    return this.http.get(`customers/portal/invoices/?customer_id=${customerId}`);
  }

  // Returns - Filtered by customer
  getReturns(): Observable<any> {
    const customerId = this.getCustomerId();
    return this.http.get(`customers/portal/returns/?customer_id=${customerId}`);
  }

  // Credit Notes - Filtered by customer
  getCreditNotes(): Observable<any> {
    const customerId = this.getCustomerId();
    return this.http.get(`customers/portal/credit-notes/?customer_id=${customerId}`);
  }

  // Ledger - Filtered by customer
  getLedger(): Observable<any> {
    const customerId = this.getCustomerId();
    return this.http.get(`customers/portal/ledger/?customer_id=${customerId}`);
  }

  // Single Sales Order - Filtered by customer
  getSalesOrderById(orderId: string): Observable<any> {
    const customerId = this.getCustomerId();
    return this.http.get(`customers/portal/sales-orders/${orderId}/?customer_id=${customerId}`);
  }

  // Create Sales Order - Automatically sets customer_id
  createSalesOrder(orderData: any): Observable<any> {
    const customerId = this.getCustomerId();
    const payload = {
      ...orderData,
      customer_id: customerId  // Force set customer_id
    };
    return this.http.post('customers/portal/sales-orders/create/', payload);
  }
}