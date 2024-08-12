import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { ProductsModule } from '../../products/products.module';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdminCommonService } from 'src/app/services/admin-common.service';
import { CustomersModule } from '../../customers/customers.module';
import { VendorsModule } from '../../vendors/vendors.module';
import { EmployeeModule } from '../../hrms/hrms.module';
import { TasksModule } from '../../tasks/tasks.module';
import { AssetsModule } from '../../assets/assets.module';
import { LeadsModule } from '../../leads/leads.module';
import { MasterModule } from '../master.module';


@Component({
  selector: 'app-master-list',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, ProductsModule, CustomersModule, VendorsModule, EmployeeModule, TasksModule, AssetsModule, LeadsModule, MasterModule],
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
        this.code = this.activeRoute.snapshot.params.code;
        // this.acs.setAction('clickMic', {});
      });
  }
  ngOnInit(): void {
    this.code = this.activeRoute.snapshot.params.code;
  }


}
