import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EmployeeUpsertDialogComponent, Employee } from '../employee-upsert-dialog/employee-upsert-dialog';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent {
  displayedColumns = ['employeeCode', 'name', 'department', 'role', 'status', 'actions'];

  rows: Employee[] = [
    {
      id: 'e1',
      employeeCode: 'EMP0001',
      name: 'Arun Kumar',
      department: 'Sales',
      role: 'Executive',
      status: 'ACTIVE',
      joinDate: '2025-06-10'
    },
    {
      id: 'e2',
      employeeCode: 'EMP0002',
      name: 'Meera Nair',
      department: 'Accounts',
      role: 'Accountant',
      status: 'ACTIVE',
      joinDate: '2025-08-01'
    }
  ];

  constructor(private dialog: MatDialog) {}

  private nextEmployeeCode(): string {
    const max = this.rows.reduce((m, e) => {
      const n = Number((e.employeeCode || '').replace('EMP', ''));
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);

    return `EMP${String(max + 1).padStart(4, '0')}`;
  }

  private openDrawer(data: Employee | null): void {
    const ref = this.dialog.open(EmployeeUpsertDialogComponent, {
      data,
      panelClass: 'right-drawer-dialog',
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '50vw',
      maxWidth: '100vw',
      autoFocus: false
    });

    ref.afterClosed().subscribe((result: Employee | null) => {
      if (!result) return;

      // ADD
      if (!data) {
        result.employeeCode = this.nextEmployeeCode();
        this.rows = [result, ...this.rows];
        return;
      }

      // EDIT
      this.rows = this.rows.map(x => (x.id === result.id ? result : x));
    });
  }

  add(): void {
    this.openDrawer(null);
  }

  edit(row: Employee): void {
    this.openDrawer(row);
  }

  remove(row: Employee): void {
    this.rows = this.rows.filter(x => x.id !== row.id);
  }
}
