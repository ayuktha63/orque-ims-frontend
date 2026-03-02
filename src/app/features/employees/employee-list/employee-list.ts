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
import { ToastService } from '../../../core/services/toast.service';

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

  displayedColumns = [
    'employeeCode',
    'name',
    'email',
    'department',
    'role',
    'status',
    'actions'
  ];

  private refresh$ = new BehaviorSubject<void>(undefined);
  rows$ = this.refresh$.pipe(
    switchMap(() => this.service.list())
  );

  constructor(
    private dialog: MatDialog,
    private service: EmployeeService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {}

  // ✅ PUBLIC (Template safe)
  canManageEmployees(): boolean {
    const role = this.auth.getRole();
    return role === 'SYSTEM_ADMIN' ||
           role === 'MANAGER' ||
           role === 'HR';
  }

  fetchData(): void {
    this.refresh$.next();
  }

  private openDrawer(data: Employee | null): void {

    if (!this.canManageEmployees()) {
      this.toast.warning('Permission denied');
      return;
    }

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
    this.openDrawer(null);
  }

  edit(row: Employee): void {
    this.openDrawer(row);
  }

  remove(row: Employee): void {

    if (!this.canManageEmployees()) {
      this.toast.warning('You do not have permission to delete employees');
      return;
    }

    if (row.role === 'SYSTEM_ADMIN' &&
        this.auth.getRole() !== 'SYSTEM_ADMIN') {
      this.toast.warning('Only System Admin can delete another System Admin');
      return;
    }

    if (!row.id) return;

    if (!confirm(`Delete ${row.name}?`)) {
      this.toast.info('Delete cancelled');
      return;
    }

    this.service.delete(row.id).subscribe({
      next: () => {
        this.toast.success('Employee deleted successfully');
        this.fetchData();
      },
      error: () => {
        this.toast.error('Delete failed');
      }
    });
  }
}