import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { catchError, forkJoin, map } from 'rxjs';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';


@Component({
  selector: 'app-sales-dispatch',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './sales-dispatch.component.html',
  styleUrls: ['./sales-dispatch.component.scss']
})
export class SalesDispatchComponent implements OnInit {
  saleOrders: any[] = []; // Array to hold sale orders
  isLoading = true; // Loading state for the component
  showMessage: boolean = false;
  messageText: string = '';
  selectedOrderId: string | null = null;

  actions = [
    {
      type: 'yes',
      label: 'YES',
      confirm: true,
      confirmMsg: "Are you sure for dispatch ready?",
      apiUrl: 'sales/sale_order/{saleOrderId}/workflow_pipeline/'
    },
    {
      type: 'no',
      label: 'NO'
    }
  ];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchSaleOrders(); // Fetch sale orders on component initialization
  }

  fetchSaleOrders() {
    this.http.get<any>('sales/sale_order/?flow_status=ready').pipe(
      map(res => res.data), // Extract data from response
      catchError(error => {
        console.error('Error fetching sale orders:', error);
        this.isLoading = false;
        return [];
      })
    ).subscribe(saleOrders => {
      this.saleOrders = saleOrders; // Update sale orders
      if (this.saleOrders.length > 0) {
        this.fetchSaleOrderDetailsForAll(); // Fetch details for each sale order
      } else {
        this.isLoading = false;
      }
    });
  }

  fetchSaleOrderDetailsForAll() {
    const detailRequests = this.saleOrders.map(order =>
      this.fetchSaleOrderDetails(order.sale_order_id).pipe(
        map(details => ({ ...order, sale_order_items: details })),
        catchError(error => {
          console.error(`Error fetching details for order ${order.sale_order_id}:`, error);
          return { ...order, sale_order_items: [] }; // Return order with empty items
        })
      )
    );

    forkJoin(detailRequests).subscribe(updatedOrders => {
      this.saleOrders = updatedOrders; // Update sale orders with detailed data
      this.isLoading = false;
    });
  }

  fetchSaleOrderDetails(saleOrderId: string) {
    return this.http.get<any>(`sales/sale_order_items/?sale_order_id=${saleOrderId}`).pipe(
      map(res => res.data) // Extract data from response
    );
  }

  onActionClick(actionType: string, saleOrderId: string) {
    const action = this.actions.find(act => act.type === actionType);

    if (action?.confirm) {
      if (confirm(action.confirmMsg)) {
        const url = action.apiUrl.replace('{saleOrderId}', saleOrderId);
        
        this.http.post(url, {}).subscribe(
          response => {
            console.log('POST request successful:', response);
          },
          error => {
            console.error('Error in POST request:', error);
            alert('Failed to update sale order. Please try again.');
          }
        );
      }
    } else {
      console.log(`Action ${actionType} for Sale Order ID: ${saleOrderId}`);
    }
  }
 
}