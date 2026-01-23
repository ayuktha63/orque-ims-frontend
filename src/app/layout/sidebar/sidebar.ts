import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  private auth = inject(AuthService);

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
    { label: 'Employees', icon: 'people', route: '/app/employees' },
    { label: 'Finance', icon: 'paid', route: '/app/finance' },
    { label: 'Payroll', icon: 'payments', route: '/app/payroll' },
    { label: 'Invoices', icon: 'receipt_long', route: '/app/invoices' },
    { label: 'Clients', icon: 'groups', route: '/app/clients' },
    { label: 'Credentials', icon: 'admin_panel_settings', route: '/app/credentials', adminOnly: true }
  ];

  // This is what the HTML is looking for
  get filteredMenu() {
    return this.menuItems.filter(item => !item.adminOnly || this.auth.canEdit());
  }
}