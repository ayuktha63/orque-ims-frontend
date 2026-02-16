import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DutyService } from '../../../core/services/duty';
import { EmployeeService } from '../../../core/services/employees';

@Component({
  standalone: true,
  selector: 'app-duty-upsert-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './duty-upsert-dialog.html'
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

    // ✅ CREATE FORM HERE (fb already injected)
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deadline: [''],
      employeeId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.employees$ = this.empService.list();
  }

  save(): void {

    if (this.form.invalid) return;

    this.service.create(this.form.value).subscribe({
      next: () => this.ref.close(true),
      error: err => console.error('Duty create failed', err)
    });
  }
}
