import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

type PayrollEntry = {
  id: string;
  payrollCode: string;
  month: string;        // YYYY-MM
  employeeName: string;
  employeeCode: string;
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
};

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule],
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
      employeeName: 'Arun Kumar',
      employeeCode: 'EMP0001',
      basic: 25000,
      allowances: 5000,
      deductions: 2000,
      netPay: 28000
    },
    {
      id: '2',
      payrollCode: 'PAY0002',
      month: '2026-01',
      employeeName: 'Meera Nair',
      employeeCode: 'EMP0002',
      basic: 30000,
      allowances: 4000,
      deductions: 3500,
      netPay: 30500
    },
    {
      id: '3',
      payrollCode: 'PAY0003',
      month: '2025-12',
      employeeName: 'Rahul S',
      employeeCode: 'EMP0003',
      basic: 22000,
      allowances: 3000,
      deductions: 1000,
      netPay: 24000
    }
  ];

  add(): void {
    // UI-only dummy
    console.log('Add Payroll clicked');
  }

  edit(row: PayrollEntry): void {
    // UI-only dummy
    console.log('Edit Payroll', row);
  }

  remove(row: PayrollEntry): void {
    // UI-only dummy delete (removes from table)
    this.rows = this.rows.filter(x => x.id !== row.id);
  }
}
