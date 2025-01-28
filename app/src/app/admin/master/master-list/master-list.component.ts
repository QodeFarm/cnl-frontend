import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdminCommonService } from 'src/app/services/admin-common.service';
import { CustomersModule } from '../../customers/customers.module';
import { VendorsModule } from '../../vendors/vendors.module';
import { EmployeeModule } from '../../hrms/hrms.module';
import { TasksModule } from '../../tasks/tasks.module';
import { LeadsModule } from '../../leads/leads.module';
import { OrdersModule } from '../../orders/orders.module';
import { ProductsModule } from '../../products/products.module';
import { AssetsModule } from '../../assets/assets.module';
// import { MasterModule } from '../master.module';
import { RemindersModule } from '../../reminders/reminders.module';
import { UsergroupsModule } from '../../usergroups/usergroups.module';
import { ProductionModule } from '../../production/workorder.module';


@Component({
  selector: 'app-master-list',
  standalone: true,
  // imports: [CommonModule, AdminCommmonModule, CustomersModule, VendorsModule, EmployeeModule, TasksModule, LeadsModule, OrdersModule, ProductsModule, AssetsModule],//removed ProductsModule, AssetsModule
  imports: [CommonModule, AdminCommmonModule, ProductsModule, CustomersModule, VendorsModule, EmployeeModule, TasksModule, AssetsModule, LeadsModule, OrdersModule, RemindersModule, UsergroupsModule, ProductionModule,],//removed MasterModule
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.scss']
})
export class MasterListComponent {
  code = 'master/master';
  private routerEventsSubscription: Subscription;
  constructor(private router: Router, private activeRoute: ActivatedRoute, private acs: AdminCommonService) {
    this.routerEventsSubscription = this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        //debugger;
        this.code = this.getCode();
        // this.acs.setAction('clickMic', {});
      });
  }
  ngOnInit(): void {
    if (this.router.url) {
      this.code = this.getCode();
    }
    //this.code = this.activeRoute.snapshot.params.code;
  }
  getCode() {
    const url = this.router.url;
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }


}
