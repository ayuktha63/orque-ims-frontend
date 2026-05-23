import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { EmployeeService } from '../../../core/services/employees';
import { Employee } from '../../../core/models/employee.model';
import { ToastService } from '../../../core/services/toast.service';

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
    private service: EmployeeService,
    private toast: ToastService,
    private ref: MatDialogRef<EmployeeUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {

    this.isEdit = !!this.data;

    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required]],
      email: [
        this.data?.email ?? '',
        [Validators.required, Validators.email]
      ],   // ✅ ADDED
      department: [this.data?.department ?? ''],
      role: [this.data?.role ?? ''],
      joinDate: [
        this.data?.joinDate ?? new Date().toISOString().split('T')[0],
        [Validators.required]
      ],
      status: [this.data?.status ?? 'ACTIVE', [Validators.required]]
    });
  }

  save(): void {

    if (this.form.invalid) {
      this.toast.info('Please fill all required fields correctly');
      return;
    }

    const payload: Employee = this.form.value;

    if (this.isEdit && this.data?.id) {

      this.service.update(this.data.id, payload).subscribe({

        next: (res: any) => {
          this.toast.success(res?.message || 'Employee updated successfully');
          this.ref.close(true);
        },

        error: (err) => {
          const msg =
            err?.error?.message ||
            err?.message ||
            'Update failed';

          this.toast.error(msg);
        }
      });

    } else {

      this.service.create(payload).subscribe({

        next: (res: any) => {
          this.toast.success(res?.message || 'Employee created successfully');
          this.ref.close(true);
        },

        error: (err) => {
          const msg =
            err?.error?.message ||
            err?.message ||
            'Creation failed';

          this.toast.error(msg);
        }
      });
    }
  }

  close(): void {
    this.ref.close(false);
  }
}