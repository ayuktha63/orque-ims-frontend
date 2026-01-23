import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { PayrollEntry } from '../../../core/models/payroll.model';
import { PayrollService } from '../../../core/services/payroll';
import { EmployeeService, Employee } from '../../../core/services/employees';

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
export class PayrollUpsertDialogComponent implements OnInit {
  isEdit: boolean;
  form: FormGroup;
  employees: Employee[] = [];
  
  // FIX: Adding this property back so the HTML can find it
  selectedEmployee?: Employee;

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private employeeService: EmployeeService,
    private ref: MatDialogRef<PayrollUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PayrollEntry | null
  ) {
    this.isEdit = !!this.data;

    this.form = this.fb.group({
      month: [this.data?.month ?? new Date().toISOString().slice(0, 7), [Validators.required]],
      employeeId: [this.data?.employeeId ?? '', [Validators.required]],
      basic: [this.data?.basic ?? 0, [Validators.required, Validators.min(0)]],
      allowances: [this.data?.allowances ?? 0, [Validators.required, Validators.min(0)]],
      deductions: [this.data?.deductions ?? 0, [Validators.required, Validators.min(0)]],
      notes: [this.data?.notes ?? '']
    });
  }

  ngOnInit(): void {
    // 1. Load the list of employees for the dropdown
    this.employeeService.list().subscribe(list => {
      this.employees = list;
      
      // 2. If editing, set the initial selected employee info
      if (this.isEdit && this.data) {
        this.updateSelectedEmployee(this.data.employeeId);
      }
    });

    // 3. Listen for changes when the user selects a different employee
    this.form.get('employeeId')?.valueChanges.subscribe(id => {
      this.updateSelectedEmployee(Number(id));
    });
  }

  private updateSelectedEmployee(id: number): void {
    this.selectedEmployee = this.employees.find(e => e.id === id);
  }

  get netPreview(): number {
    const { basic, allowances, deductions } = this.form.value;
    const b = Number(basic) || 0;
    const a = Number(allowances) || 0;
    const d = Number(deductions) || 0;
    return Math.max(0, b + a - d);
  }

  save(): void {
    if (this.form.invalid) return;

    // Build the payload including the calculated netPay
    const payload = {
      ...this.form.value,
      netPay: this.netPreview
    };

    if (this.isEdit && this.data && typeof this.data.id === 'number') {
      this.payrollService.update(this.data.id, payload).subscribe({
        next: () => this.ref.close(true),
        error: (err) => console.error('Payroll update failed', err)
      });
    } else {
      this.payrollService.add(payload).subscribe({
        next: () => this.ref.close(true),
        error: (err) => console.error('Payroll creation failed', err)
      });
    }
  }

  close(): void {
    this.ref.close(false);
  }
}