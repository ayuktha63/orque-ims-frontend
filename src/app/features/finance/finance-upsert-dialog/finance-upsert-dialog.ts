import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FinanceEntry } from '../../../core/services/models';
import { FinanceService } from '../../../core/services/finance';
import { ToastService } from '../../../core/services/toast.service'; // ✅ ADD

@Component({
  selector: 'app-finance-upsert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './finance-upsert-dialog.html',
  styleUrls: ['./finance-upsert-dialog.css']
})
export class FinanceUpsertDialogComponent {

  isEdit: boolean;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private finance: FinanceService,
    private toast: ToastService, // ✅ INJECT
    private ref: MatDialogRef<FinanceUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FinanceEntry | null
  ) {

    this.isEdit = !!this.data;

    this.form = this.fb.group({
      date: [this.data?.date ?? new Date().toISOString().slice(0,10), Validators.required],
      type: [this.data?.type ?? 'EXPENSE', Validators.required],
      category: [this.data?.category ?? '', Validators.required],
      amount: [this.data?.amount ?? 0, [Validators.required, Validators.min(1)]],
      paymentMode: [this.data?.paymentMode ?? 'UPI', Validators.required],
      description: [this.data?.description ?? '']
    });
  }

  save(): void {

    if (this.form.invalid) {
      this.toast.info('Please fill all required fields');
      return;
    }

    const v = this.form.value;

    if (this.isEdit && this.data?.id) {

      this.finance.update(this.data.id, v).subscribe({

        next: (res:any) => {
          this.toast.success(res?.message || 'Finance entry updated');
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

      this.finance.add(v).subscribe({

        next: (res:any) => {
          this.toast.success(res?.message || 'Finance entry added');
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

  minimize(): void {
    this.ref.close({
      minimized: true,
      draft: this.form.value
    });
  }
}