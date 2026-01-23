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
    data: { breadcrumb: 'Home' }, 
    children: [
      // Default child redirect
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      
      // Feature Routes with Breadcrumb Labels
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
      { 
        path: 'invoices', 
        component: InvoicesComponent, 
        data: { breadcrumb: 'Invoices' } 
      },
      { 
        path: 'clients', 
        component: ClientsComponent, 
        data: { breadcrumb: 'Clients' } 
      },
      
      // Admin Only Route
      { 
        path: 'credentials', 
        component: CredentialsComponent, 
        data: { breadcrumb: 'System Access' } 
      }
    ]
  },

  // 4. Wildcard Catch-all
  { path: '**', redirectTo: 'login' }
];