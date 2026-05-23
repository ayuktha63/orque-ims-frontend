import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';

import { SettingsService } from '../../core/services/settings';
import { AuthService } from '../../core/services/auth';
import { RoleAccessService, RoleAccess } from '../../core/services/role-access.service';

interface RoleAccessUI extends RoleAccess {
  parsedScreens: string[];
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {

  // Default configuration
  config = {
    profit: true,
    incomeChart: true,
    categoryChart: true,
    duties: true,
    upcomingLeaves: true
  };

  isLoading = true;
  isSaving = false;

  // Role Management
  roles: RoleAccessUI[] = [];
  newRoleName = '';
  screensList = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'myTask', label: 'My Work / Duties' },
    { id: 'employees', label: 'Employees' },
    { id: 'finance', label: 'Finance' },
    { id: 'duties', label: 'Duty Roster' },
    { id: 'credentials', label: 'System Access' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'clients', label: 'Clients' },
    { id: 'defects', label: 'Defects' }
  ];
  selectedScreens: { [key: string]: boolean } = {};
  isSystemAdmin = false;
  isRoleLoading = false;

  constructor(
    private settingsService: SettingsService,
    private auth: AuthService,
    private roleService: RoleAccessService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isSystemAdmin = this.auth.getRole() === 'SYSTEM_ADMIN';
    this.loadSettings();
    if (this.isSystemAdmin) {
      this.loadRoles();
    }
  }

  // --- ROLE MANAGEMENT ---
  loadRoles(): void {
    setTimeout(() => {
      this.isRoleLoading = true;
      this.cd.detectChanges();
    });
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = res.map(role => {
          let parsed: string[] = [];
          try {
            if (role.accessConfigJson) {
              const parsedJson = JSON.parse(role.accessConfigJson);
              // Handle flat ["a","b"] or nested [["a","b"]] automatically
              const flatArray = Array.isArray(parsedJson[0]) ? parsedJson.flat() : parsedJson;

              parsed = flatArray.map((id: string) => {
                const match = this.screensList.find(s => s.id === id);
                return match ? match.label : id;
              });
            }
          } catch (e) {
            console.warn('Could not parse screens for role', role.roleName);
          }
          return { ...role, parsedScreens: parsed };
        });

        this.isRoleLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        this.isRoleLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  saveNewRole(): void {
    if (!this.newRoleName.trim()) { return; }

    // Convert selectedScreens object to an array of string IDs that are true
    const accessScreens = Object.keys(this.selectedScreens).filter(key => this.selectedScreens[key]);

    const rolePayload: RoleAccess = {
      roleName: this.newRoleName.trim().toUpperCase(),
      accessConfigJson: JSON.stringify(accessScreens)
    };

    this.roleService.createOrUpdateRole(rolePayload).subscribe({
      next: (saved) => {
        this.snackBar.open(`Role ${saved.roleName} saved successfully!`, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
        setTimeout(() => {
          this.newRoleName = '';
          this.selectedScreens = {}; // Reset selection
          this.loadRoles(); // Refresh table
        });
      },
      error: (err) => {
        this.snackBar.open('Error saving role', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
        console.error(err);
      }
    });
  }

  deleteRole(roleId: number): void {
    if (!confirm('Are you sure you want to delete this role?')) return;
    this.roleService.deleteRole(roleId).subscribe({
      next: () => {
        this.snackBar.open('Role deleted', 'Close', { duration: 3000 });
        setTimeout(() => this.loadRoles());
      },
      error: (err) => console.error(err)
    });
  }

  loadSettings(): void {
    const employeeId = this.auth.employeeId();
    if (!employeeId) {
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }

    this.settingsService.getSettings(String(employeeId)).subscribe({
      next: (settings) => {
        if (settings && settings.configJson) {
          try {
            const parsed = JSON.parse(settings.configJson);
            this.config = { ...this.config, ...parsed }; // Merge with defaults
          } catch (e) {
            console.error('Failed to parse settings JSON', e);
          }
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.warn('Could not load settings from backend', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  saveSettings(): void {
    const employeeId = this.auth.employeeId();
    if (!employeeId) return;

    this.isSaving = true;

    this.settingsService.saveSettings(String(employeeId), JSON.stringify(this.config)).subscribe({
      next: () => {
        this.isSaving = false;
        this.cd.detectChanges();
        this.snackBar.open('Settings saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Failed to save settings', err);
        this.isSaving = false;
        this.cd.detectChanges();
        this.snackBar.open('Failed to save settings. Please try again.', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
