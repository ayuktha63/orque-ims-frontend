import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../core/services/auth';
import { RoleAccessService } from '../../core/services/role-access.service';

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
export class SidebarComponent implements OnInit {

  allowedScreens: string[] = [];

  constructor(
    public auth: AuthService,
    private roleService: RoleAccessService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userRole = this.auth.getRole();
    
    // System Admins inherently see everything
    if (userRole === 'SYSTEM_ADMIN') {
      setTimeout(() => {
        this.allowedScreens = ['dashboard', 'myTask', 'employees', 'finance', 'duties', 'credentials', 'attendance', 'payroll', 'invoices', 'clients', 'defects'];
        this.cd.detectChanges();
      });
      return;
    }

    // Dynamic Role Fetching
    if (userRole) {
      this.roleService.getRoleByName(userRole).subscribe({
        next: (roleAccess) => {
          if (roleAccess && roleAccess.accessConfigJson) {
            try {
              setTimeout(() => {
                this.allowedScreens = JSON.parse(roleAccess.accessConfigJson);
                this.cd.detectChanges();
              });
            } catch (e) {
              console.error('Failed to parse role access', e);
            }
          }
        },
        error: (err) => console.warn('No custom role access defined for ' + userRole, err)
      });
    }
  }

  // ===== DYNAMIC MENU VISIBILITY =====
  
  hasAccess(screenId: string): boolean {
    if (this.auth.getRole() === 'SYSTEM_ADMIN') return true;
    return this.allowedScreens.includes(screenId);
  }

  showDashboard(): boolean { return this.hasAccess('dashboard'); }
  showMyTask(): boolean { return this.hasAccess('myTask'); }
  showEmployees(): boolean { return this.hasAccess('employees'); }
  showDuties(): boolean { return this.hasAccess('duties'); }
  showCredentials(): boolean { return this.hasAccess('credentials'); }
  showAttendance(): boolean { return this.hasAccess('attendance'); }
  showFinance(): boolean { return this.hasAccess('finance'); }
  showPayroll(): boolean { return this.hasAccess('payroll'); }
  showClients(): boolean { return this.hasAccess('clients'); }

}