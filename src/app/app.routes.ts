import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AppShellComponent } from './layout/app-shell/app-shell';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

// Core Features
import { DashboardComponent } from './features/dashboard/dashboard';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list';
import { FinanceListComponent } from './features/finance/finance-list/finance-list';
import { PayrollListComponent } from './features/payroll/payroll-list/payroll-list';
import { InvoicesComponent } from './features/invoices/invoices/invoices';
import { CredentialsComponent } from './features/credential/credentials/credentials';
import { InvoiceListComponent } from './features/invoices/invoices/invoice-list/invoice-list';

// DUTY MODULE
import { DutyListComponent } from './features/duty/duty-list/duty-list';
import { MyWorkComponent } from './features/duty/my-work/my-work';

// ✅ ADD DEFECT PAGE IMPORT
import { DutyDefectDialogComponent } from './features/duty/duty-defect-dialog/duty-defect-dialog';

// ATTENDANCE MODULE
import { AttendanceComponent } from './features/attendance/attendance';

// SETTINGS MODULE
import { SettingsComponent } from './features/settings/settings';
import { ClientsComponent } from './features/clients/clients/clients';
import { ClientListComponent } from './features/clients/client-list/client-list.component';

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
        canActivate: [roleGuard],
        data: { breadcrumb: 'Dashboard', screenId: 'dashboard' }
      },
      {
        path: 'employees',
        component: EmployeeListComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'Employees', screenId: 'employees' }
      },
      {
        path: 'finance',
        component: FinanceListComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'Finance', screenId: 'finance' }
      },
      {
        path: 'payroll',
        component: PayrollListComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'Payroll', screenId: 'payroll' }
      },

      // ================= DUTY MODULE =================

      {
        path: 'duties',
        component: DutyListComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'Duties', screenId: 'duties' }
      },
      {
        path: 'my-work',
        component: MyWorkComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'My Work', screenId: 'myTask' }
      },

      // ✅ NEW DEFECT PAGE ROUTE
      {
        path: 'defects',
        component: DutyDefectDialogComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'Defects', screenId: 'defects' }
      },

      // ================= ATTENDANCE =================
      {
        path: 'attendance',
        component: AttendanceComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'Attendance', screenId: 'attendance' }
      },

      // ================= INVOICES =================

      {
        path: 'invoices',
        canActivate: [roleGuard],
        data: { breadcrumb: 'Invoices', screenId: 'invoices' },
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
        component: ClientListComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'Clients', screenId: 'clients' }
      },
      {
        path: 'credentials',
        component: CredentialsComponent,
        canActivate: [roleGuard],
        data: { breadcrumb: 'System Access', screenId: 'credentials' }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { breadcrumb: 'Settings' }
      }

    ]
  },

  // ================= WILDCARD =================
  { path: '**', redirectTo: 'login' }
];
