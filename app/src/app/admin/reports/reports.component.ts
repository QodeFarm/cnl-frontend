// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-reports',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './reports.component.html',
//   styleUrls: ['./reports.component.scss']
// })
// export class ReportsComponent {

// }



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdminCommonService } from 'src/app/services/admin-common.service';
import { CustomersModule } from '../customers/customers.module';
import { VendorsModule } from '../vendors/vendors.module';
import { EmployeeModule } from '../hrms/hrms.module';
import { TasksModule } from '../tasks/tasks.module';
import { LeadsModule } from '../leads/leads.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { AssetsModule } from '../assets/assets.module';
// import { MasterModule } from '../master.module';
import { RemindersModule } from '../reminders/reminders.module';
import { UsergroupsModule } from '../usergroups/usergroups.module';
import { ProductionModule } from '../production/workorder.module';
import { SalesListComponent } from "../sales/sales-list/sales-list.component";
import { SalesInvoiceListComponent } from "../sales/salesinvoice/salesinvoice-list/salesinvoice-list.component";
import { SalesReportsComponent } from '../sales/sales-reports/sales-reports.component';


@Component({
  selector: 'app-reports',
  standalone: true,
  // imports: [CommonModule, AdminCommmonModule, CustomersModule, VendorsModule, EmployeeModule, TasksModule, LeadsModule, OrdersModule, ProductsModule, AssetsModule],//removed ProductsModule, AssetsModule
  imports: [CommonModule, AdminCommmonModule, ProductsModule, CustomersModule, VendorsModule, EmployeeModule, TasksModule, AssetsModule, LeadsModule, OrdersModule, RemindersModule, UsergroupsModule, ProductionModule],//removed MasterModule
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  isAccordionOpen = true;
  selectedReport: any = null;
  reports = {
    test1: {
      columns: ['ID', 'Name', 'Age'],
      data: [
        { ID: 1, Name: 'Alice', Age: 25 },
        { ID: 2, Name: 'Bob', Age: 30 },
      ],
    },
    test2: {
      columns: ['Product', 'Category', 'Price'],
      data: [
        { Product: 'Laptop', Category: 'Electronics', Price: 1000 },
        { Product: 'Table', Category: 'Furniture', Price: 150 },
      ],
    },
  };


  selectReport(reportKey: string) {
    this.selectedReport = this.reports[reportKey] || null;
  }
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
  // code: string = ''; // Default state
  // private routerEventsSubscription: Subscription;
  // constructor(private router: Router, private activeRoute: ActivatedRoute, private acs: AdminCommonService) {
  //   this.routerEventsSubscription = this.router.events
  //     .pipe(
  //       filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
  //     ).subscribe((event: NavigationEnd) => {
  //       //debugger;
  //       this.code = this.getCode();
  //       // this.acs.setAction('clickMic', {});
  //     });
  // }
  // ngOnInit(): void {
  //   if (this.router.url) {
  //     this.code = this.getCode();
  //   }
  //   //this.code = this.activeRoute.snapshot.params.code;
  // }
  // getCode() {
  //   const url = this.router.url;
  //   const parts = url.split('/');
  //   const lastPart = parts[parts.length - 1];
  //   return lastPart;
  // }

  // isAccordionOpen: boolean = true; // ✅ Track accordion state

  //   // ✅ Toggles the accordion manually
  //   toggleAccordion() {
  //     this.isAccordionOpen = !this.isAccordionOpen;
  // }

  // // ✅ Opens Sales Summary Report and closes the accordion
  // openSalesList() {
  //   if (this.code === 'sales') {
  //     this.code = ''; // Toggle off
  //     this.isAccordionOpen = true; // Reopen accordion
  //   } else {
  //     this.code = 'sales'; // Open report
  //     this.isAccordionOpen = false; // Close accordion
  //   }
  // }

  // // ✅ Opens Sales Invoice Report and closes the accordion
  // openSalesInvoiceList() {
  //   if (this.code === 'sales-invoice') {
  //     this.code = ''; // Toggle off
  //     this.isAccordionOpen = true; // Reopen accordion
  //   } else {
  //     this.code = 'sales-invoice'; // Open report
  //     this.isAccordionOpen = false; // Close accordion
  //   }
  // }
}