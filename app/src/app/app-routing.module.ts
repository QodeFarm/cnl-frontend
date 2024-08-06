import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { appGuard } from './guards/app.guard';
import { AuthguardGuard } from './guards/authguard.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [appGuard],
    children: [
      { path: '', canActivate: [], loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
      { path: 'activation/:uid/:token', canActivate: [], loadComponent: () => import('./pages/activation/activation.component').then(m => m.ActivationComponent) },
      { path: 'create-account', canActivate: [], loadComponent: () => import('./pages/create-account/create-account.component').then(m => m.CreateAccountComponent) },
      { path: 'reset-password/:uid/:token', canActivate: [], loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
    ]
  },
  {
    path: 'admin',
    // canActivate: [AuthguardGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'profile', canActivate: [], loadChildren: () => import('./admin/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'dashboard', canActivate: [], loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', canActivate: [], loadChildren: () => import('./admin/user/user.module').then(m => m.UserModule) },
      { path: 'sales', canActivate: [], loadChildren: () => import('./admin/sales/sales.module').then(m => m.SalesModule) },
      // { path: 'employee', canActivate: [], loadChildren: () => import('./admin/employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'master', canActivate: [], loadChildren: () => import('./admin/master/master.module').then(m => m.MasterModule) },
      { path: 'company', canActivate: [], loadChildren: () => import('./admin/company/company.module').then(m => m.CompanyModule) },
      { path: 'employees', canActivate: [], loadChildren: () => import('./admin/hrms/hrms.module').then(m => m.EmployeeModule) },
      { path: 'leads', canActivate: [], loadChildren: () => import('./admin/leads/leads.module').then(m => m.LeadsModule) },
      { path: 'vendors', canActivate: [], loadChildren: () => import('./admin/vendors/vendors.module').then(m => m.VendorsModule) },
      { path: 'warehouses', canActivate: [], loadChildren: () => import('./admin/warehouses/warehouses.module').then(m => m.WarehousesModule) },
      { path: 'quickpacks', canActivate: [], loadChildren: () => import('./admin/quickpacks/quickpacks.module').then(m => m.QuickpacksModule) },
      { path: 'assets', canActivate: [], loadChildren: () => import('./admin/assets/assets.module').then(m => m.AssetsModule) },
      { path: 'tasks', canActivate: [], loadChildren: () => import('./admin/tasks/tasks.module').then(m => m.TasksModule) },
      // { path: 'leaves', canActivate: [], loadComponent: () => import('./admin/leave/leave.component').then(m => m.LeaveComponent) },
      // { path: 'attendance', canActivate: [], loadChildren: () => import('./admin/attendence/attendence.module').then(m => m.AttendenceModule) },
      { path: 'inventory', canActivate: [], loadChildren: () => import('./admin/inventory/inventory.module').then(m => m.InventoryModule) },
      { path: 'products', canActivate: [], loadChildren: () => import('./admin/products/products.module').then(m => m.ProductsModule) },
      { path: 'purchase', canActivate: [], loadChildren: () => import('./admin/purchase/purchase.module').then(m => m.PurchaseModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
