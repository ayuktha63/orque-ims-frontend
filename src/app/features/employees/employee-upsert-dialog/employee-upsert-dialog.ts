import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export type Employee = {
  id: string;
  employeeCode: string; // set by list during Add
  name: string;
  department?: string;
  role?: string;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE';
};

type EmployeeForm = {
  name: any;
  department: any;
  role: any;
  joinDate: any;
  status: any;
};

function uid(): string {
  return crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

function yyyyMmDd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-employee-upsert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './employee-upsert-dialog.html',
  styleUrls: ['./employee-upsert-dialog.css']
})
export class EmployeeUpsertDialogComponent {
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EmployeeUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {
    this.isEdit = !!this.data;

    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required]],
      department: [this.data?.department ?? ''],
      role: [this.data?.role ?? ''],
      joinDate: [this.data?.joinDate ?? yyyyMmDd(new Date()), [Validators.required]],
      status: [this.data?.status ?? 'ACTIVE', [Validators.required]]
    } as EmployeeForm);
  }

  save(): void {
    if (this.form.invalid) return;

    const v = this.form.value as any;

    const result: Employee = {
      id: this.data?.id ?? uid(),
      employeeCode: this.data?.employeeCode ?? 'AUTO',
      name: v.name,
      department: v.department || '',
      role: v.role || '',
      joinDate: v.joinDate,
      status: v.status
    };

    this.ref.close(result);
  }

  close(): void {
    this.ref.close(null);
  }
}
