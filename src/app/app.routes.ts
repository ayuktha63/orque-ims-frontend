import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AppShellComponent } from './layout/app-shell/app-shell';
import { authGuard } from './core/guards/auth-guard';

// Feature Components
import { DashboardComponent } from './features/dashboard/dashboard';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list';
import { FinanceListComponent } from './features/finance/finance-list/finance-list';
import { PayrollListComponent } from './features/payroll/payroll-list/payroll-list';
import { InvoicesComponent } from './features/invoices/invoices/invoices';
import { ClientsComponent } from './features/clients/clients/clients';
import { CredentialsComponent } from './features/credential/credentials/credentials';

export const routes: Routes = [
  // 1. Root Redirect
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // 2. Public Route
  { path: 'login', component: LoginComponent },

  // 3. Protected Shell Route
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      // Default child redirect
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      
      // Feature Routes
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'finance', component: FinanceListComponent },
      { path: 'payroll', component: PayrollListComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'clients', component: ClientsComponent },
      
      // Admin Only Route
      { path: 'credentials', component: CredentialsComponent }
    ]
  },

  // 4. Wildcard Catch-all (Redirects to login if route doesn't exist)
  { path: '**', redirectTo: 'login' }
];