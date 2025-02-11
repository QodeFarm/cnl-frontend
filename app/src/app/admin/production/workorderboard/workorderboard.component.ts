import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router'; // Import Router
import { TaCurdConfig } from '@ta/ta-curd';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-workorderboard',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './workorderboard.component.html',
  styleUrls: ['./workorderboard.component.scss']
})
export class WorkorderboardComponent implements OnInit {
  isLoading = true;
  showModal = false;
  showViewModal = false; // New variable for view modal
  selectedOrder: any = null;

  curdConfig: TaCurdConfig = this.getCurdConfig();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isLoading = false;
  }

  getCurdConfig(): TaCurdConfig {
    return {
      drawerSize: 500,
      drawerPlacement: 'right',
      tableConfig: {
        apiUrl: 'production/work_order/?summary=true&flow_status=Production',
        title: 'Work Order',
        pkId: "work_order_id",
        pageSize: 10,
        globalSearch: {
          keys: ['product', 'quantity', 'status_id', 'start_date', 'end_date']
        },
        defaultSort: { key: 'created_at', value: 'descend' },
        cols: [
          {
            fieldKey: 'product',
            name: 'Product',
            displayType: "map",
            mapFn: (currentValue: any, row: any, col: any) => {
              return `${row.product.name}`;
            },
            sort: true
          },
          {
            fieldKey: 'quantity',
            name: 'Quantity',
            sort: true
          },
          {
            fieldKey: 'status_id',
            name: 'Status',
            displayType: 'map',
            mapFn: (currentValue: any, row: any) => `${row.status.status_name}`,
            sort: true
          },
          {
            fieldKey: 'start_date',
            name: 'Start Date',
            sort: true
          },
          {
            fieldKey: 'end_date',
            name: 'End Date',
            sort: true
          },
          {
            fieldKey: 'actions',
            name: 'Actions',
            type: 'action',
            actions: [
              {
                type: 'callBackFn',
                label: 'Done',
                callBackFn: (row: any) => this.openModal(row),
              },
              {
                type: 'callBackFn',
                label: 'View', // Action for viewing details
                callBackFn: (row: any) => {
                  console.log('View button clicked for:', row);
                  this.onViewWorkOrder(row.work_order_id); // Pass only the ID, not the entire row
                }
              }
              
            ]
          }
        ]
      },
      formConfig: {
        url: 'sales/sale_order/{saleOrderId}/move_next_stage/',
        title: 'Work Order Confirmation',
        pkId: "sale_order_id",
        exParams: [],
        fields: [
          {
            key: 'sale_order_id',
            type: 'text',
          },
          {
            key: 'confirmation',
            type: 'select',
            defaultValue: 'yes'
          }
        ]
      }
    };
  }

  openModal(order: any) {
    this.selectedOrder = order;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }

  //code for view button in workorderboard
  onViewWorkOrder(workOrderId: string) {
    console.log('Fetching details for view, work order ID:', workOrderId);
    this.selectedOrder = null; // Clear any previous data
  
    // Make an API call to fetch the complete work order details
    this.http.get(`production/work_order/${workOrderId}`).subscribe(
      (res: any) => {
        console.log('Received response for work order view:', res);
  
        if (res && res.data) {
          const data = res.data;
  
          // Populate selectedOrder with all necessary fields from the response
          this.selectedOrder = {
            ...data.work_order,
            materials: data.bom || [], // Map the `bom` field as `materials`
            machines: data.work_order_machines.map((machine: any) => ({
              machineName: machine.machine.machine_name // Map nested `machine.machine_name`
            })) || [],
            workers: data.workers.map((worker: any) => ({
              workerName: worker.employee.name, // Map nested `employee.name`
              hoursWorked: worker.hours_worked // Map `hours_worked`
            })) || [],
            workStages: data.work_order_stages || []
          };
  
          console.log('Selected order populated with full data:', this.selectedOrder);
  
          // Display the view modal with the complete data
          this.showViewModal = true;
        } else {
          console.warn('No data found for work order ID:', workOrderId);
        }
      },
      error => {
        console.error('Error fetching work order details:', error);
        alert('Failed to fetch work order details. Please try again.');
      }
    );
  }
  
  

  

  closeViewModal() {
    this.showViewModal = false;
    this.selectedOrder = null;
  }

  confirmDispatch() {
    if (this.selectedOrder) {
      const saleOrderId = this.selectedOrder.sale_order_id;
      const url = `sales/SaleOrder/${saleOrderId}/move_next_stage/`;

      this.http.post(url, {}).subscribe(
        () => {
          console.log('Dispatch confirmed for order:', saleOrderId);
          this.closeModal();
          this.refreshCurdConfig();
        },
        error => {
          console.error('Error in confirming dispatch:', error);
          alert('Failed to confirm dispatch. Please try again.');
        }
      );
    }
  }

  refreshCurdConfig() {
    this.curdConfig = this.getCurdConfig();
  }
}
