import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AppShellComponent } from './layout/app-shell/app-shell';
import { authGuard } from './core/guards/auth-guard';
import { DashboardComponent } from './features/dashboard/dashboard';
import { FinanceListComponent } from './features/finance/finance-list/finance-list';
import { InvoicesComponent } from './features/invoices/invoices/invoices';
import { ClientsComponent } from './features/clients/clients/clients';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: LoginComponent },

  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'finance', component: FinanceListComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'clients', component: ClientsComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
