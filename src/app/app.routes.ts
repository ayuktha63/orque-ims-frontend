import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AppShellComponent } from './layout/app-shell/app-shell';
import { authGuard } from './core/guards/auth-guard';
import { DashboardComponent } from './features/dashboard/dashboard';
import { FinanceListComponent } from './features/finance/finance-list/finance-list';
import { InvoicesComponent } from './features/invoices/invoices/invoices';
import { ClientsComponent } from './features/clients/clients/clients';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list';
import { PayrollListComponent } from './features/payroll/payroll-list/payroll-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: LoginComponent },

  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    data: { breadcrumb: 'Home' },          // optional label for app root
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'employees', component: EmployeeListComponent, data: { breadcrumb: 'Employees' } },
      { path: 'payroll', component: PayrollListComponent, data: { breadcrumb: 'Payroll' } },
      { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
      { path: 'finance', component: FinanceListComponent, data: { breadcrumb: 'Finance' } },
      { path: 'invoices', component: InvoicesComponent, data: { breadcrumb: 'Invoices' } },
      { path: 'clients', component: ClientsComponent, data: { breadcrumb: 'Clients' } }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
