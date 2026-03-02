import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  constructor(public auth: AuthService) {}

  // ===== ROLE CHECKS =====

  private role(): string {
    return this.auth.getRole();
  }

  isSystemAdmin(): boolean {
    return this.role() === 'SYSTEM_ADMIN';
  }

  isManager(): boolean {
    return this.role() === 'MANAGER';
  }

  isHR(): boolean {
    return this.role() === 'HR';
  }

  isFinance(): boolean {
    return this.role() === 'FINANCE';
  }

  // ===== MENU VISIBILITY (FINAL LOGIC) =====

  showDashboard(): boolean {
    return true; // ALL roles
  }

  showMyTask(): boolean {
    return true; // ALL roles
  }

  showEmployees(): boolean {
    return this.isSystemAdmin() ||
           this.isManager() ||
           this.isHR();
  }

  showDuties(): boolean {
    return this.isSystemAdmin() ||
           this.isManager() ||
           this.isHR();
  }

  showCredentials(): boolean {
    return this.isSystemAdmin() ||
           this.isHR();
  }

  showFinance(): boolean {
    return this.isSystemAdmin() ||
           this.isFinance();
  }

  showPayroll(): boolean {
    return this.isSystemAdmin() ||
           this.isFinance();
  }

}