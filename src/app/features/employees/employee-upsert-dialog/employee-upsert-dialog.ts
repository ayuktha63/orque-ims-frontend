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
    private ref: MatDialogRef<EmployeeUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {
    this.isEdit = !!this.data;

    // Initialize form with existing data or defaults
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required]],
      department: [this.data?.department ?? ''],
      role: [this.data?.role ?? ''],
      // Standardizes the date to YYYY-MM-DD for the HTML date input
      joinDate: [this.data?.joinDate ?? new Date().toISOString().split('T')[0], [Validators.required]],
      status: [this.data?.status ?? 'ACTIVE', [Validators.required]]
    });
  }

  save(): void {
    if (this.form.invalid) return;

    // The form value is combined with the original ID if editing
    const payload: Employee = this.form.value;

    if (this.isEdit && this.data?.id) {
      // Logic for PUT (Update)
      this.service.update(this.data.id, payload).subscribe({
        next: () => {
          // Send 'true' to trigger refresh in the list component
          this.ref.close(true);
        },
        error: (err) => {
          console.error('Update failed:', err);
          // You could add a snackbar/toast error message here
        }
      });
    } else {
      // Logic for POST (Create)
      this.service.create(payload).subscribe({
        next: () => {
          // Send 'true' to trigger refresh in the list component
          this.ref.close(true);
        },
        error: (err) => {
          console.error('Creation failed:', err);
        }
      });
    }
  }

  close(): void {
    // Send 'false' so the list component knows NOT to trigger a refresh
    this.ref.close(false);
  }
}