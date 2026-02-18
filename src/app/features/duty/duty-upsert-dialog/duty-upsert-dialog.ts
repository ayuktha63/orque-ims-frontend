import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DutyService } from '../../../core/services/duty';
import { EmployeeService } from '../../../core/services/employees';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-duty-upsert-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './duty-upsert-dialog.html',
  styleUrl: './duty-upsert-dialog.css'
})
export class DutyUpsertDialogComponent implements OnInit {

  employees$!: any;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: DutyService,
    private empService: EmployeeService,
    private ref: MatDialogRef<DutyUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deadline: [null], // must be Date object from picker
      employeeId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.employees$ = this.empService.list();
  }

  close(): void {
    this.ref.close();
  }

  // ============================================
  // ✅ CONVERT DATE → YYYY-MM-DD (NO TIMEZONE)
  // ============================================
  private toDateOnly(date: Date | null): string | null {

    if (!date) return null;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
  }

  // ============================================
  // SAVE DUTY
  // ============================================
  save(): void {

    if (this.form.invalid) return;

    const v = this.form.value;

    // ✅ IMPORTANT FIX
    const payload = {
      ...v,
      deadline: this.toDateOnly(v.deadline)
    };

    this.service.create(payload).subscribe({
      next: () => this.ref.close(true),
      error: err => console.error('Duty create failed', err)
    });
  }

}
