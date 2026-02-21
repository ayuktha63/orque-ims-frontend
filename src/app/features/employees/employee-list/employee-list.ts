import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, switchMap } from 'rxjs';

import { EmployeeService } from '../../../core/services/employees';
import { Employee } from '../../../core/models/employee.model';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast.service'; // ✅

import { EmployeeUpsertDialogComponent } from '../employee-upsert-dialog/employee-upsert-dialog';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent implements OnInit {

  displayedColumns = ['employeeCode', 'name', 'department', 'role', 'status', 'actions'];

  private refresh$ = new BehaviorSubject<void>(undefined);
  rows$ = this.refresh$.pipe(switchMap(() => this.service.list()));

  constructor(
    private dialog: MatDialog,
    private service: EmployeeService,
    private toast: ToastService, // ✅ inject
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  fetchData(): void {
    this.refresh$.next();
  }

  private openDrawer(data: Employee | null): void {

    const ref = this.dialog.open(EmployeeUpsertDialogComponent, {
      data,
      panelClass: 'right-drawer-dialog',
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '50vw',
      autoFocus: false
    });

    ref.afterClosed().subscribe((didSave: boolean) => {
      if (didSave) {
        this.fetchData();
      }
    });
  }

  add(): void {
    if (this.auth.canEdit()) {
      this.openDrawer(null);
    }
  }

  edit(row: Employee): void {
    this.openDrawer(row);
  }

  // ======================================================
  // ✅ SAFE DELETE WITH ADMIN PROTECTION
  // ======================================================
  remove(row: Employee): void {

    // Guard: only editors
    if (!this.auth.canEdit()) {
      this.toast.warning('You do not have permission to delete employees');
      return;
    }

    // 🚨 NEW RULE:
    // ADMIN cannot delete ADMIN
    if (row.role === 'ADMIN') {
      this.toast.warning('Admins cannot delete another Admin');
      return;
    }

    if (!row.id) return;

    if (!confirm(`Are you sure you want to delete ${row.name}?`)) {
      this.toast.info('Delete cancelled');
      return;
    }

    this.service.delete(row.id).subscribe({

      next: () => {
        this.toast.success('Employee deleted successfully');
        this.fetchData();
      },

      error: (err) => {

        // handle auth/session errors nicely
        if (err.status === 401) {
          this.toast.error('Session expired or unauthorized action');
          return;
        }

        const msg =
          err?.error?.message ||
          err?.message ||
          'Delete failed';

        this.toast.error(msg);
      }

    });
  }
}