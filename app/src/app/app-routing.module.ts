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
    title: 'Admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'profile', data: { title: 'Profile', moduleName: 'profile' }, canActivate: [], loadChildren: () => import('./admin/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'dashboard', data: { title: 'Dashbord', moduleName: 'dashboard' }, canActivate: [], loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', data: { title: 'Users', moduleName: 'Users' }, canActivate: [], loadChildren: () => import('./admin/user/user.module').then(m => m.UserModule) },
      // sales module
      { path: 'sales', data: { title: 'Sales', moduleName: 'Sales' }, canActivate: [], loadComponent: () => import('./admin/sales/sales.component').then(m => m.SalesComponent) },
      {
        path: 'sales/sale-returns',
        data: { title: 'Sales Returns', moduleName: "sales-return" },
        loadComponent: () => import('./admin/sales/sale-returns/sale-returns.component').then(m => m.SaleReturnsComponent)
      },
      {
        path: 'sales/salesinvoice',
        data: { title: 'Sales Invoice', moduleName: "sales-invoice" },
        loadComponent: () => import('./admin/sales/salesinvoice/salesinvoice.component').then(m => m.SalesinvoiceComponent)
      },
      {
        path: 'sales/sales-dispatch',
        data: { title: 'Sale Dispatch', moduleName: "sales-dispatch" },
        loadComponent: () => import('./admin/sales/sales-dispatch/sales-dispatch.component').then(m => m.SalesDispatchComponent)
      },
      { path: 'sale-receipt', data: { title: 'SaleReceipt', moduleName: 'sale-receipt' }, canActivate: [], loadComponent: () => import('./admin/sales/sale-receipt/sale-receipt.component').then(m => m.SaleReceiptComponent) },


      { path: 'customers', data: { title: 'Customers', moduleName: 'customers' }, canActivate: [], loadComponent: () => import('./admin/customers/customers.component').then(m => m.CustomersComponent) },

      // { path: 'employee', canActivate: [], loadChildren: () => import('./admin/employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'master', data: { title: 'Master', moduleName: 'master' }, pathMatch: 'full', redirectTo: 'master/master' },
      { path: 'master/:code', data: { title: 'Master', moduleName: 'master' }, canActivate: [], loadComponent: () => import('./admin/master/master-list/master-list.component').then(m => m.MasterListComponent) },
      { path: 'company', data: { title: 'Company', moduleName: 'company' }, canActivate: [], loadChildren: () => import('./admin/company/company.module').then(m => m.CompanyModule) },
      { path: 'employees', data: { title: 'Employees', moduleName: 'employees' }, canActivate: [], loadChildren: () => import('./admin/hrms/hrms.module').then(m => m.EmployeeModule) },
      { path: 'leads', data: { title: 'Leads', moduleName: 'lead' }, canActivate: [], loadChildren: () => import('./admin/leads/leads.module').then(m => m.LeadsModule) },
      { path: 'vendors', data: { title: 'vendors', moduleName: 'vendors' }, canActivate: [], loadChildren: () => import('./admin/vendors/vendors.module').then(m => m.VendorsModule) },
      { path: 'warehouses', data: { title: 'warehouses', moduleName: 'warehouses' }, canActivate: [], loadChildren: () => import('./admin/warehouses/warehouses.module').then(m => m.WarehousesModule) },
      { path: 'quickpacks', data: { title: 'quickpacks', moduleName: 'quickpacks' }, canActivate: [], loadChildren: () => import('./admin/quickpacks/quickpacks.module').then(m => m.QuickpacksModule) },
      { path: 'assets', data: { title: 'assets', moduleName: 'assets' }, canActivate: [], loadChildren: () => import('./admin/assets/assets.module').then(m => m.AssetsModule) },
      { path: 'tasks', data: { title: 'tasks', moduleName: 'tasks' }, canActivate: [], loadChildren: () => import('./admin/tasks/tasks.module').then(m => m.TasksModule) },
      // { path: 'leaves', canActivate: [], loadComponent: () => import('./admin/leave/leave.component').then(m => m.LeaveComponent) },
      // { path: 'attendance', canActivate: [], loadChildren: () => import('./admin/attendence/attendence.module').then(m => m.AttendenceModule) },
      { path: 'inventory', data: { title: 'inventory', moduleName: 'inventory' }, canActivate: [], loadChildren: () => import('./admin/inventory/inventory.module').then(m => m.InventoryModule) },
      { path: 'products', data: { title: 'products', moduleName: 'products' }, canActivate: [], loadChildren: () => import('./admin/products/products.module').then(m => m.ProductsModule) },
      { path: 'purchase', data: { title: 'purchase', moduleName: 'purchase' }, canActivate: [], loadChildren: () => import('./admin/purchase/purchase.module').then(m => m.PurchaseModule) },
      { path: 'production', data: { title: 'production', moduleName: 'production' }, canActivate: [], loadChildren: () => import('./admin/production/production.module').then(m => m.ProductionModule) },
      { path: 'finance', data: { title: 'finance', moduleName: 'finance' }, canActivate: [], loadChildren: () => import('./admin/finance/finance.module').then(m => m.FinanceModule) },
      // { path: 'voiceassistant', canActivate: [], loadChildren: () => import('./admin/voiceassistant/voiceassistant.module').then(m => m.VoiceassistantModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
