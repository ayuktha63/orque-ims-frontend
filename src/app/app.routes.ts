import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AppShellComponent } from './layout/app-shell/app-shell';
import { authGuard } from './core/guards/auth-guard';

// Core Features
import { DashboardComponent } from './features/dashboard/dashboard';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list';
import { FinanceListComponent } from './features/finance/finance-list/finance-list';
import { PayrollListComponent } from './features/payroll/payroll-list/payroll-list';
import { InvoicesComponent } from './features/invoices/invoices/invoices';
import { ClientsComponent } from './features/clients/clients/clients';
import { CredentialsComponent } from './features/credential/credentials/credentials';
import { InvoiceListComponent } from './features/invoices/invoices/invoice-list/invoice-list';

// DUTY MODULE
import { DutyListComponent } from './features/duty/duty-list/duty-list';
import { MyWorkComponent } from './features/duty/my-work/my-work';

// ✅ ADD DEFECT PAGE IMPORT
import { DutyDefectDialogComponent } from './features/duty/duty-defect-dialog/duty-defect-dialog';

export const routes: Routes = [

  // ================= ROOT REDIRECT =================
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // ================= PUBLIC =================
  { path: 'login', component: LoginComponent },

  // ================= APP SHELL =================
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    data: { breadcrumb: 'Home' },
    children: [

      // Default child redirect
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // ================= CORE FEATURES =================

      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: 'employees',
        component: EmployeeListComponent,
        data: { breadcrumb: 'Employees' }
      },
      {
        path: 'finance',
        component: FinanceListComponent,
        data: { breadcrumb: 'Finance' }
      },
      {
        path: 'payroll',
        component: PayrollListComponent,
        data: { breadcrumb: 'Payroll' }
      },

      // ================= DUTY MODULE =================

      {
        path: 'duties',
        component: DutyListComponent,
        data: { breadcrumb: 'Duties' }
      },
      {
        path: 'my-work',
        component: MyWorkComponent,
        data: { breadcrumb: 'My Work' }
      },

      // ✅ NEW DEFECT PAGE ROUTE
      {
        path: 'defects',
        component: DutyDefectDialogComponent,
        data: { breadcrumb: 'Defects' }
      },

      // ================= INVOICES =================

      {
        path: 'invoices',
        data: { breadcrumb: 'Invoices' },
        children: [
          {
            path: '',
            component: InvoicesComponent,
            data: { breadcrumb: 'Create' }
          },
          {
            path: 'list',
            component: InvoiceListComponent,
            data: { breadcrumb: 'Search' }
          }
        ]
      },

      // ================= OTHER FEATURES =================

      {
        path: 'clients',
        component: ClientsComponent,
        data: { breadcrumb: 'Clients' }
      },
      {
        path: 'credentials',
        component: CredentialsComponent,
        data: { breadcrumb: 'System Access' }
      }

    ]
  },

  // ================= WILDCARD =================
  { path: '**', redirectTo: 'login' }
];
