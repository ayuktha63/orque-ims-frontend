import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { CredentialService } from '../../../core/services/credential';
@Component({
  selector: 'app-credential-upsert-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule
  ],
  templateUrl: './credential-upsert-dialog.html',
  styleUrls: ['./credential-upsert-dialog.css']
})
export class CredentialUpsertDialogComponent {
  form: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private service: CredentialService,
    public ref: MatDialogRef<CredentialUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = !!data.employee.username;

    this.form = this.fb.group({
      username: [data.employee.username || '', [Validators.required]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(8)]],
      role: [data.employee.role || 'USER', [Validators.required]]
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      employeeId: this.data.employee.id
    };

    this.service.upsert(payload).subscribe({
      next: () => this.ref.close(true),
      error: (err) => console.error('Save failed', err)
    });
  }
}