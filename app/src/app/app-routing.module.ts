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
    canActivate: [AuthguardGuard],
    title: 'Admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'profile', data: { title: 'Profile', moduleName: 'profile' }, canActivate: [], loadChildren: () => import('./admin/profile/profile.module').then(m => m.ProfileModule) },
      { path: 'dashboard', data: { title: 'Dashbord', moduleName: 'dashboard' }, canActivate: [], loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'profile/change-password', data: { title: 'Change Password', moduleName: 'change-password' }, canActivate: [], loadComponent: () => import('./admin/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
      // { path: 'users', data: { title: 'Users', moduleName: 'Users' }, canActivate: [], loadChildren: () => import('./admin/user/user.component').then(m => m.UserComponent) },
      // sales module
      { path: 'sales', data: { title: 'Sales', moduleName: 'Sales' }, canActivate: [], loadComponent: () => import('./admin/sales/sales.component').then(m => m.SalesComponent) },
      { path: 'sales/sale-returns', data: { title: 'Sales Returns', moduleName: "sales-return" }, loadComponent: () => import('./admin/sales/sale-returns/sale-returns.component').then(m => m.SaleReturnsComponent) },
      { path: 'sales/salesinvoice', data: { title: 'Sales Invoice', moduleName: "sales-invoice" }, loadComponent: () => import('./admin/sales/salesinvoice/salesinvoice.component').then(m => m.SalesinvoiceComponent) },
      { path: 'sales/sales-dispatch', data: { title: 'Sale Dispatch', moduleName: "sales-dispatch" }, loadComponent: () => import('./admin/sales/sales-dispatch/sales-dispatch.component').then(m => m.SalesDispatchComponent) },
      { path: 'sale-receipt', data: { title: 'Sale Receipt', moduleName: 'sale-receipt' }, canActivate: [], loadComponent: () => import('./admin/sales/sale-receipt/sale-receipt.component').then(m => m.SaleReceiptComponent) },
      { path: 'sales/debit-note', data: { title: 'Sale Debit Note', moduleName: 'debit-note' }, canActivate: [], loadComponent: () => import('./admin/sales/debit-note/debit-note.component').then(m => m.DebitNoteComponent) },
      { path: 'sales/credit-note', data: { title: 'Sale Credit Note', moduleName: 'credit-note' }, canActivate: [], loadComponent: () => import('./admin/sales/credit-note/credit-note.component').then(m => m.CreditNoteComponent) },
      { path: 'customers', data: { title: 'Customers', moduleName: 'customers' }, canActivate: [], loadComponent: () => import('./admin/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'sales/payment-receipt', data: { title: 'Payment Receipt', moduleName: "payment-receipt" }, loadComponent: () => import('./admin/sales/payment-receipt/payment-receipt.component').then(m => m.PaymentReceiptComponent) },


      //Purchase Module
      { path: 'purchase', data: { title: 'Purchase', moduleName: 'purchase' }, canActivate: [], loadComponent: () => import('./admin/purchase/purchase.component').then(m => m.PurchaseComponent) },
      { path: 'purchase/purchase-invoice', data: { title: 'Purchase Invoice', moduleName: "purchaseinvoice" }, loadComponent: () => import('./admin/purchase/purchase-invoice/purchase-invoice.component').then(m => m.PurchaseInvoiceComponent) },
      { path: 'purchase/purchasereturns', data: { title: 'Purchase Returns', moduleName: "purchasereturns" }, loadComponent: () => import('./admin/purchase/purchasereturnorders/purchasereturnorders.component').then(m => m.PurchasereturnordersComponent) },
      { path: 'vendors', data: { title: 'Vendors', moduleName: 'vendors' }, canActivate: [], loadComponent: () => import('./admin/vendors/vendors.component').then(m => m.VendorsComponent) },

      // { path: 'employee', canActivate: [], loadChildren: () => import('./admin/employee/employee.module').then(m => m.EmployeeModule) },

      //Leads Module
      { path: 'leads', data: { title: 'Leads', moduleName: 'leads' }, canActivate: [], loadComponent: () => import('./admin/leads/leads.component').then(m => m.LeadsComponent) },

      //Employees Module
      { path: 'employees', data: { title: 'Employees', moduleName: 'employees' }, canActivate: [], loadComponent: () => import('./admin/hrms/hrms.component').then(m => m.EmployeesComponent) },
      { path: 'hrms/employee-salary', data: { title: 'Employee Salary', moduleName: 'employee-salary' }, canActivate: [], loadComponent: () => import('./admin/hrms/employee-salary/employee-salary.component').then(m => m.EmployeeSalaryComponent) },
      { path: 'hrms/employee-leaves', data: { title: 'Employee Leaves', moduleName: 'employee-leaves' }, canActivate: [], loadComponent: () => import('./admin/hrms/employee-leaves/employee-leaves.component').then(m => m.EmployeeLeavesComponent) },
      { path: 'hrms/leave-approvals', data: { title: 'Leave Approvals', moduleName: 'leave-approvals' }, canActivate: [], loadComponent: () => import('./admin/hrms/leave-approvals/leave-approvals.component').then(m => m.LeaveApprovalsComponent) },
      { path: 'hrms/employee-leave-balance', data: { title: 'Employee Leave Balance', moduleName: 'employee-leave-balance' }, canActivate: [], loadComponent: () => import('./admin/hrms/employee-leave-balance/employee-leave-balance.component').then(m => m.EmployeeLeaveBalanceComponent) },
      { path: 'hrms/employee-attendance', data: { title: 'Employee Attendance', moduleName: 'employee-attendance' }, canActivate: [], loadComponent: () => import('./admin/hrms/employee-attendance/employee-attendance.component').then(m => m.EmployeeAttendanceComponent) },
      { path: 'hrms/swipes', data: { title: 'Swipes', moduleName: 'swipes' }, canActivate: [], loadComponent: () => import('./admin/hrms/swipes/swipes.component').then(m => m.SwipesComponent) },

      //Products Module
      { path: 'inventory', data: { title: 'Inventory', moduleName: 'inventory' }, canActivate: [], loadComponent: () => import('./admin/inventory/inventory.component').then(m => m.InventoryComponent) },
      // { path: 'production/stockjournal', data: { title: 'Stock Journal', moduleName: 'stockjournal' }, canActivate: [], loadComponent: () => import('./admin/stockjournal/stockjournal.component').then(m => m.StockjournalComponent) },
      // { path: 'products', data: { title: 'Products', moduleName: 'products' }, canActivate: [], loadComponent: () => import('./admin/products/products.component').then(m => m.ProductsComponent) },
      { path: 'warehouses', data: { title: 'Warehouses', moduleName: 'warehouses' }, canActivate: [], loadComponent: () => import('./admin/warehouses/warehouses.component').then(m => m.WarehousesComponent) },
      { path: 'quickpacks', data: { title: 'Quick Packs', moduleName: 'quickpacks' }, canActivate: [], loadComponent: () => import('./admin/quickpacks/quickpacks.component').then(m => m.QuickpacksComponent) },

      //Tasks Module
      { path: 'tasks', data: { title: 'Tasks', moduleName: 'tasks' }, canActivate: [], loadComponent: () => import('./admin/tasks/tasks.component').then(m => m.TasksComponent) },

      //Assets Module
      { path: 'assets/assets', data: { title: 'Assets', moduleName: 'assets' }, canActivate: [], loadComponent: () => import('./admin/assets/assets.component').then(m => m.AssetsComponent) },
      { path: 'assets/asset-maintenance', data: { title: 'Asset Maintenance', moduleName: "asset-maintenance" }, loadComponent: () => import('./admin/assets/asset-maintenance/asset-maintenance.component').then(m => m.AssetMaintenanceComponent) },

      //Production Module
      { path: 'production', data: { title: 'Work Order', moduleName: 'production' }, canActivate: [], loadComponent: () => import('./admin/production/workorder.component').then(m => m.WorkorderComponent) },
      { path: 'production/bom', data: { title: 'BOM', moduleName: 'bom' }, canActivate: [], loadComponent: () => import('./admin/production/bom/bom.component').then(m => m.BomComponent) },
      { path: 'production/machines', data: { title: 'Machines', moduleName: 'machines' }, canActivate: [], loadComponent: () => import('./admin/production/machines/machines.component').then(m => m.MachinesComponent) },
      { path: 'production/productionstatuses', data: { title: 'Production Statuses', moduleName: 'productionstatuses' }, canActivate: [], loadComponent: () => import('./admin/production/production-statuses/production-statuses.component').then(m => m.ProductionStatusesComponent) },
      { path: 'production/workorderboard', data: { title: 'Work Order Board', moduleName: 'workorderboard' }, canActivate: [], loadComponent: () => import('./admin/production/workorderboard/workorderboard.component').then(m => m.WorkorderboardComponent) },
      //Finance Module
      { path: 'finance/bank-account', data: { title: 'Bank Account', moduleName: 'finance' }, canActivate: [], loadComponent: () => import('./admin/finance/bank-account/bank-account.component').then(m => m.BankAccountComponent) },
      { path: 'finance/chart-of-accounts', data: { title: 'Chart Of Accounts', moduleName: 'chart-of-accounts' }, canActivate: [], loadComponent: () => import('./admin/finance/chart-of-accounts/chart-of-accounts.component').then(m => m.ChartOfAccountsComponent) },
      { path: 'finance/journal-entry', data: { title: 'Journal Entry', moduleName: 'journal-entry' }, canActivate: [], loadComponent: () => import('./admin/finance/journal-entry/journal-entry.component').then(m => m.JournalEntryComponent) },
      { path: 'finance/payment-transaction', data: { title: 'Payment Transaction', moduleName: 'payment-transaction' }, canActivate: [], loadComponent: () => import('./admin/finance/payment-transaction/payment-transaction.component').then(m => m.PaymentTransactionComponent) },
      { path: 'finance/tax-configuration', data: { title: 'Tax Configuration', moduleName: 'tax-configuration' }, canActivate: [], loadComponent: () => import('./admin/finance/tax-configuration/tax-configuration.component').then(m => m.TaxConfigurationComponent) },
      { path: 'finance/budget', data: { title: 'Budget', moduleName: 'budget' }, canActivate: [], loadComponent: () => import('./admin/finance/budget/budget.component').then(m => m.BudgetComponent) },
      { path: 'finance/expense-claim', data: { title: 'Expense Claim', moduleName: 'expense-claim' }, canActivate: [], loadComponent: () => import('./admin/finance/expense-claim/expense-claim.component').then(m => m.ExpenseClaimComponent) },
      { path: 'finance/expense-category', data: { title: 'Expense Categories', moduleName: 'expense-category' }, canActivate: [], loadComponent: () => import('./admin/finance/expense-category/expense-category.component').then(m => m.ExpenseCategoryComponent) },
      { path: 'finance/expense-item', data: { title: 'Expense Items', moduleName: 'expense-item' }, canActivate: [], loadComponent: () => import('./admin/finance/expense-item/expense-item.component').then(m => m.ExpenseItemComponent) },
      { path: 'finance/financial-report', data: { title: 'Financial Report', moduleName: 'financial-report' }, canActivate: [], loadComponent: () => import('./admin/finance/financial-report/financial-report.component').then(m => m.FinancialReportComponent) },
      { path: 'finance/gst', data: { title: 'GST', moduleName: 'gst-details' }, canActivate: [], loadComponent: () => import('./admin/finance/gst-details/gst-details.component').then(m => m.GstDetailsComponent) },
      { path: 'finance/account-ledger', data: { title: 'Account ledger', moduleName: 'account-ledger' }, canActivate: [], loadComponent: () => import('./admin/finance/account-ledger/account-ledger.component').then(m => m.AccountLedgerComponent) },

      //Company Module
      { path: 'company', data: { title: 'Company', moduleName: 'company' }, canActivate: [], loadComponent: () => import('./admin/company/company.component').then(m => m.CompanyComponent) },
      { path: 'company/branches', data: { title: 'Branches', moduleName: 'branches' }, canActivate: [], loadComponent: () => import('./admin/company/branches/branches.component').then(m => m.BranchesComponent) },
      
      //Company Module
      { path: 'reminders', data: { title: 'Reminders', moduleName: 'reminders' }, canActivate: [], loadComponent: () => import('./admin/reminders/reminders.component').then(m => m.RemindersComponent) },
      // { path: 'company/branches', data: { title: 'Branches', moduleName: 'branches' }, canActivate: [], loadComponent: () => import('./admin/company/branches/branches.component').then(m => m.BranchesComponent) },

      //workflow
      { path: 'workflow', data: { title: 'Workflow', moduleName: 'Workflow' }, canActivate: [], loadComponent: () => import('./admin/workflow/workflow.component').then(m => m.WorkflowComponent) },

      //Users Module
      { path: 'users', data: { title: 'Users', moduleName: 'users' }, canActivate: [], loadComponent: () => import('./admin/user/user.component').then(m => m.UserComponent) },
      { path: 'users/roles', data: { title: 'User Roles', moduleName: 'user roles' }, canActivate: [], loadComponent: () => import('./admin/user/roles/roles.component').then(m => m.RolesComponent) },

      { path: 'usergroups', data: { title: 'User Groups', moduleName: 'user groups' }, canActivate: [], loadComponent: () => import('./admin/usergroups/usergroups.component').then(m => m.UsergroupsComponent) },

      { path: 'master', data: { title: 'Master', moduleName: 'master' }, pathMatch: 'full', redirectTo: 'master/master' },
      { path: 'master/:code', data: { title: 'Master', moduleName: 'master' }, canActivate: [], loadComponent: () => import('./admin/master/master-list/master-list.component').then(m => m.MasterListComponent) },
      { path: 'leads', data: { title: 'Leads', moduleName: 'lead' }, canActivate: [], loadChildren: () => import('./admin/leads/leads.module').then(m => m.LeadsModule) },
      { path: 'products', data: { title: 'Products', moduleName: 'products' }, canActivate: [], loadChildren: () => import('./admin/products/products.module').then(m => m.ProductsModule) },
      { path: 'assets', data: { title: 'Assets', moduleName: 'assets' }, canActivate: [], loadChildren: () => import('./admin/assets/assets.module').then(m => m.AssetsModule) },

      //Reporting Tool
      { path: 'reports/custome-reports', data: { title: 'Reports', moduleName: 'reports' }, canActivate: [], loadComponent: () => import('./admin/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'reports/sales-reports', data: { title: 'Sales Reports', moduleName: 'sales-reports' }, canActivate: [], loadComponent: () => import('./admin/reports/sales-reports/sales-reports.component').then(m => m.SalesRepotsComponent) },
      { path: 'reports/purchase-reports', data: { title: 'Purchase Reports', moduleName: 'purchase-reports' }, canActivate: [], loadComponent: () => import('./admin/reports/purchase-reports/purchase-reports.component').then(m => m.PurchaseReportsComponent) },
      { path: 'reports/ledgers-reports', data: { title: 'Ledgers Reports', moduleName: 'ledgers-reports' }, canActivate: [], loadComponent: () => import('./admin/reports/ledgers-reports/ledgers-reports.component').then(m => m.LedgersReportsComponent) },
      { path: 'reports/vendor-reports', data: { title: 'Vendor Reports', moduleName: 'vendor-reports' }, canActivate: [], loadComponent: () => import('./admin/reports/vendor-reports/vendor-reports.component').then(m => m.VendorReportsComponent) },
      { path: 'reports/customer-reports', data: { title: 'Customer Reports', moduleName: 'customer-reports' }, canActivate: [], loadComponent: () => import('./admin/reports/customer-reports/customer-reports.component').then(m => m.CustomerReportsComponent) },
      { path: 'reports/production-reports', data: { title: 'Production Reports', moduleName: 'production-reports' }, canActivate: [], loadComponent: () => import('./admin/reports/production-reports/production-reports.component').then(m => m.ProductionReportsComponent) },
      { path: 'reports/gst-reports', data: { title: 'Gst Reports', moduleName: 'gst-reports' }, canActivate: [], loadComponent: () => import('./admin/reports/gst-reports/gst-reports.component').then(m => m.GstReportsComponent) },






      //Customfields Tool
      { path: 'customfields', data: { title: 'customfields', moduleName: 'customfields' }, canActivate: [], loadChildren: () => import('./admin/customfields/customfields.module').then(m => m.CustomfieldsModule) },


      // { path: 'production', data: { title: 'production', moduleName: 'production' }, canActivate: [], loadChildren: () => import('./admin/production/production.module').then(m => m.ProductionModule) },
      // { path: 'finance', data: { title: 'finance', moduleName: 'finance' }, canActivate: [], loadChildren: () => import('./admin/finance/finance.module').then(m => m.FinanceModule) },




      // { path: 'employees', data: { title: 'Employees', moduleName: 'employees' }, canActivate: [], loadChildren: () => import('./admin/hrms/hrms.module').then(m => m.EmployeeModule) },

      // { path: 'vendors', data: { title: 'vendors', moduleName: 'vendors' }, canActivate: [], loadChildren: () => import('./admin/vendors/vendors.module').then(m => m.VendorsModule) },
      // { path: 'warehouses', data: { title: 'warehouses', moduleName: 'warehouses' }, canActivate: [], loadChildren: () => import('./admin/warehouses/warehouses.module').then(m => m.WarehousesModule) },
      // { path: 'quickpacks', data: { title: 'quickpacks', moduleName: 'quickpacks' }, canActivate: [], loadChildren: () => import('./admin/quickpacks/quickpacks.module').then(m => m.QuickpacksModule) },

      // { path: 'tasks', data: { title: 'tasks', moduleName: 'tasks' }, canActivate: [], loadChildren: () => import('./admin/tasks/tasks.module').then(m => m.TasksModule) },
      // { path: 'leaves', canActivate: [], loadComponent: () => import('./admin/leave/leave.component').then(m => m.LeaveComponent) },
      // { path: 'attendance', canActivate: [], loadChildren: () => import('./admin/attendence/attendence.module').then(m => m.AttendenceModule) },
      // { path: 'inventory', data: { title: 'inventory', moduleName: 'inventory' }, canActivate: [], loadChildren: () => import('./admin/inventory/inventory.module').then(m => m.InventoryModule) },

      // { path: 'purchase', data: { title: 'purchase', moduleName: 'purchase' }, canActivate: [], loadChildren: () => import('./admin/purchase/purchase.module').then(m => m.PurchaseModule) },

      // { path: 'inventory', data: { title: 'inventory', moduleName: 'inventory' }, canActivate: [], loadChildren: () => import('./admin/inventory/inventory.module').then(m => m.InventoryModule) },
      // { path: 'products', data: { title: 'products', moduleName: 'products' }, canActivate: [], loadChildren: () => import('./admin/products/products.module').then(m => m.ProductsModule) },
      // { path: 'purchase', data: { title: 'purchase', moduleName: 'purchase' }, canActivate: [], loadChildren: () => import('./admin/purchase/purchase.module').then(m => m.PurchaseModule) },
      // { path: 'sale-receipt', data: { title: 'Sale Receipt', moduleName: 'sale-receipt' }, canActivate: [], loadChildren: () => import('./admin/sales/sale-receipt/sale-receipt.module').then(m => m.SaleReceiptModule) },
      // { path: 'production', data: { title: 'production', moduleName: 'production' }, canActivate: [], loadChildren: () => import('./admin/production/production.module').then(m => m.ProductionModule) },
      // { path: 'finance', data: { title: 'finance', moduleName: 'finance' }, canActivate: [], loadChildren: () => import('./admin/finance/finance.module').then(m => m.FinanceModule) },
      // // { path: 'voiceassistant', canActivate: [], loadChildren: () => import('./admin/voiceassistant/voiceassistant.module').then(m => m.VoiceassistantModule) },
      // { path: 'credit-note', data: { title: 'Credit Note', moduleName: 'creditnote' }, canActivate: [], loadChildren: () => import('./admin/sales/credit-note/credit-note.module').then(m => m.CreditNoteModule) },
      // { path: 'debit-note', data: { title: 'Debit Note', moduleName: 'debitnote' }, canActivate: [], loadChildren: () => import('./admin/sales/debit-note/debit-note.module').then(m => m.DebitNoteModule) },
      // { path: 'reminders', data: { title: 'reminders', moduleName: 'reminders' }, canActivate: [], loadChildren: () => import('./admin/reminders/reminders.module').then(m => m.RemindersModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
