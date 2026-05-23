import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { CredentialService } from '../../../core/services/credential';
import { RoleAccessService, RoleAccess } from '../../../core/services/role-access.service';
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
export class CredentialUpsertDialogComponent implements OnInit {

  form: FormGroup;
  isEdit: boolean;
  availableRoles: RoleAccess[] = [];
  isLoadingRoles = true;

  constructor(
    private fb: FormBuilder,
    private service: CredentialService,
    private roleService: RoleAccessService,
    private toast: ToastService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
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
      role: [data.employee.role || '', [Validators.required]]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoadingRoles = true;
      this.cd.detectChanges();
    });

    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        // Ensure SYSTEM_ADMIN is always available as a baseline if it somehow gets deleted from DB
        const hasSysAdmin = roles.some(r => r.roleName === 'SYSTEM_ADMIN');
        if (!hasSysAdmin) {
           roles.unshift({ roleName: 'SYSTEM_ADMIN', accessConfigJson: '[]' });
        }
        
        setTimeout(() => {
          this.availableRoles = roles;
          this.isLoadingRoles = false;
          // Set initial role cleanly now that array is here
          if (!this.form.get('role')?.value && roles.length > 0) {
            this.form.get('role')?.setValue(roles[0].roleName);
          }
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error('Failed to load roles master', err);
        setTimeout(() => {
          this.isLoadingRoles = false;
          this.cd.detectChanges();
        });
      }
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