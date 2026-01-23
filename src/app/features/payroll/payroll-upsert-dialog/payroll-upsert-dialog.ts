import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

type Employee = {
  id: string;
  employeeCode: string;
  name: string;
};

export type PayrollEntry = {
  id: string;
  payrollCode: string;
  month: string;        // YYYY-MM
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
  notes?: string;
};

type PayrollForm = {
  month: any;
  employeeId: any;
  basic: any;
  allowances: any;
  deductions: any;
  notes: any;
};

function yyyyMm(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function uid(): string {
  return crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

@Component({
  selector: 'app-payroll-upsert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './payroll-upsert-dialog.html',
  styleUrls: ['./payroll-upsert-dialog.css']
})
export class PayrollUpsertDialogComponent {
  isEdit: boolean;
  form: FormGroup;

  // Dummy employees (replace later with EmployeesService)
  employees: Employee[] = [
    { id: 'e1', employeeCode: 'EMP0001', name: 'Arun Kumar' },
    { id: 'e2', employeeCode: 'EMP0002', name: 'Meera Nair' },
    { id: 'e3', employeeCode: 'EMP0003', name: 'Rahul S' }
  ];

  selectedEmployee?: Employee;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<PayrollUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PayrollEntry | null
  ) {
    this.isEdit = !!this.data;

    this.form = this.fb.group({
      month: [this.data?.month ?? yyyyMm(new Date()), [Validators.required]],
      employeeId: [this.data?.employeeId ?? this.employees[0].id, [Validators.required]],
      basic: [this.data?.basic ?? 0, [Validators.required, Validators.min(0)]],
      allowances: [this.data?.allowances ?? 0, [Validators.required, Validators.min(0)]],
      deductions: [this.data?.deductions ?? 0, [Validators.required, Validators.min(0)]],
      notes: [this.data?.notes ?? '']
    } as PayrollForm);

    // initial selection
    this.selectedEmployee = this.employees.find(e => e.id === this.form.value.employeeId);

    // selection change
    this.form.get('employeeId')!.valueChanges.subscribe((id: string) => {
      this.selectedEmployee = this.employees.find(e => e.id === id);
    });
  }

  get netPreview(): number {
    const v = this.form.value as any;
    const b = Number(v.basic) || 0;
    const a = Number(v.allowances) || 0;
    const d = Number(v.deductions) || 0;
    return Math.max(0, b + a - d);
  }

  save(): void {
    if (this.form.invalid) return;
    if (!this.selectedEmployee) return;

    const v = this.form.value as any;

    const result: PayrollEntry = {
      id: this.data?.id ?? uid(),
      payrollCode: this.data?.payrollCode ?? 'PAYXXXX',  // list page can set real code later
      month: v.month,
      employeeId: this.selectedEmployee.id,
      employeeCode: this.selectedEmployee.employeeCode,
      employeeName: this.selectedEmployee.name,
      basic: Number(v.basic) || 0,
      allowances: Number(v.allowances) || 0,
      deductions: Number(v.deductions) || 0,
      netPay: this.netPreview,
      notes: v.notes ?? ''
    };

    this.ref.close(result);
  }

  close(): void {
    this.ref.close(null);
  }
}
