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
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
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
    this.isEdit = !!data.employee.hasAccess;

    this.form = this.fb.group({
      username: [data.employee.username || '', [Validators.required]],
      // Password mandatory only for new setup
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(4)]],
      role: [data.employee.role || 'USER', [Validators.required]]
    });
  }

save(): void {
  if (this.form.invalid) return;

  const val = this.form.value;
  const payload: any = {
    employeeId: this.data.employee.employeeId, 
    username: val.username,
    role: val.role
  };

  if (val.password && val.password.trim() !== '') {
    payload.password = val.password;
  }

  this.service.upsert(payload).subscribe({
    next: (response) => {
      console.log('Update Success:', response);
      // Passing 'true' triggers the fetchData() in the main component
      this.ref.close(true); 
    },
    error: (err) => {
      console.error('Save failed', err);
      // The error ID ada55747... was likely caused by the JSON parsing failure
    }
  });
}
}