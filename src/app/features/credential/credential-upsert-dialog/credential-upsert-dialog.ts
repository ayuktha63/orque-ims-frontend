import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { CredentialService } from '../../../core/services/credential';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../duty/my-work/confirm-dialog'; // ✅ reuse your existing confirm dialog

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
    private toast: ToastService,
    private dialog: MatDialog,
    public ref: MatDialogRef<CredentialUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.isEdit = !!data.employee.hasAccess;

    this.form = this.fb.group({
      username: [data.employee.username || '', [Validators.required]],
      password: [
        data.employee.password || '',
        this.isEdit ? [] : [Validators.required, Validators.minLength(4)]
      ],
      role: [data.employee.role || 'USER', [Validators.required]]
    });
  }

  // =====================================================
  // SAVE WITH CONFIRMATION + TOAST
  // =====================================================
  save(): void {

    if (this.form.invalid) {
      this.toast.info('Please fill all required fields');
      return;
    }

    const refConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: {
        message: this.isEdit
          ? 'Update credentials for this user?'
          : 'Create credentials for this user?'
      }
    });

    refConfirm.afterClosed().subscribe(ok => {

      if (!ok) {
        this.toast.info('Action cancelled');
        return;
      }

      const val = this.form.value;

      const payload = {
        employeeId: this.data.employee.employeeId,
        username: val.username,
        role: val.role,
        password: val.password
      };

      this.service.upsert(payload).subscribe({

        next: (res:any) => {

          this.toast.success(
            res?.message ||
            (this.isEdit ? 'Credentials updated' : 'Credentials created')
          );

          this.ref.close(true);
        },

        error: (err) => {

          const msg =
            err?.error?.message ||
            err?.message ||
            'Credential save failed';

          this.toast.error(msg);
        }

      });

    });

  }
}