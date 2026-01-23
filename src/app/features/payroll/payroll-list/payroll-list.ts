import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PayrollUpsertDialogComponent, PayrollEntry } from '../payroll-upsert-dialog/payroll-upsert-dialog';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './payroll-list.html',
  styleUrls: ['./payroll-list.css']
})
export class PayrollListComponent {
  displayedColumns = ['payrollCode', 'month', 'employeeName', 'basic', 'allowances', 'deductions', 'netPay', 'actions'];

  rows: PayrollEntry[] = [
    {
      id: '1',
      payrollCode: 'PAY0001',
      month: '2026-01',
      employeeId: 'e1',
      employeeCode: 'EMP0001',
      employeeName: 'Arun Kumar',
      basic: 25000,
      allowances: 5000,
      deductions: 2000,
      netPay: 28000,
      notes: ''
    },
    {
      id: '1',
      payrollCode: 'PAY0001',
      month: '2026-01',
      employeeId: 'e1',
      employeeCode: 'EMP0001',
      employeeName: 'Arun Kumar',
      basic: 25000,
      allowances: 5000,
      deductions: 2000,
      netPay: 28000,
      notes: ''
    },
    {
      id: '1',
      payrollCode: 'PAY0001',
      month: '2026-01',
      employeeId: 'e1',
      employeeCode: 'EMP0001',
      employeeName: 'Arun Kumar',
      basic: 25000,
      allowances: 5000,
      deductions: 2000,
      netPay: 28000,
      notes: ''
    },
    {
      id: '1',
      payrollCode: 'PAY0001',
      month: '2026-01',
      employeeId: 'e1',
      employeeCode: 'EMP0001',
      employeeName: 'Arun Kumar',
      basic: 25000,
      allowances: 5000,
      deductions: 2000,
      netPay: 28000,
      notes: ''
    }
  ];

  constructor(private dialog: MatDialog) {}

  private nextPayrollCode(): string {
    const max = this.rows.reduce((m, e) => {
      const n = Number((e.payrollCode || '').replace('PAY', ''));
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);

    return `PAY${String(max + 1).padStart(4, '0')}`;
  }

  private openDrawer(data: PayrollEntry | null): void {
    const ref = this.dialog.open(PayrollUpsertDialogComponent, {
      data,
      panelClass: 'right-drawer-dialog',
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '50vw',
      maxWidth: '100vw',
      autoFocus: false
    });

    ref.afterClosed().subscribe((result: PayrollEntry | null) => {
      if (!result) return;

      // ADD
      if (!data) {
        result.payrollCode = this.nextPayrollCode();
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

  edit(row: PayrollEntry): void {
    this.openDrawer(row);
  }

  remove(row: PayrollEntry): void {
    this.rows = this.rows.filter(x => x.id !== row.id);
  }
}
