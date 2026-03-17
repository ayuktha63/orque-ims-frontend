import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientService, Client } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-upsert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './client-upsert-dialog.component.html',
  styleUrls: ['./client-upsert-dialog.component.css']
})
export class ClientUpsertDialogComponent implements OnInit {

  clientForm!: FormGroup;
  isEditMode = false;
  isSaving = false;

  statusOptions = [
    { value: 'PROSPECT', label: 'Prospect' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<ClientUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data && !!this.data.id;
    
    this.clientForm = this.fb.group({
      name: [this.data?.name || '', [Validators.required]],
      contactPerson: [this.data?.contactPerson || ''],
      email: [this.data?.email || '', [Validators.email]],
      phone: [this.data?.phone || ''],
      address: [this.data?.address || ''],
      status: [this.data?.status || 'PROSPECT', [Validators.required]],
      notes: [this.data?.notes || '']
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue: Client = this.clientForm.value;

    if (this.isEditMode && this.data.id) {
      this.clientService.updateClient(this.data.id, formValue).subscribe({
        next: (savedClient) => {
          this.snackBar.open('Client updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(savedClient);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error updating client', 'Close', { duration: 3000 });
          this.isSaving = false;
        }
      });
    } else {
      this.clientService.createClient(formValue).subscribe({
        next: (savedClient) => {
          this.snackBar.open('Client created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(savedClient);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error creating client', 'Close', { duration: 3000 });
          this.isSaving = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
