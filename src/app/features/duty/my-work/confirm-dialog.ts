import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
template: `
  <div class="dialog-header">
    <h2 mat-dialog-title>Confirm Action</h2>

    <button mat-icon-button color="warn" (click)="close()">
      <mat-icon>close</mat-icon>
    </button>
  </div>

  <div mat-dialog-content>
    {{ data.message }}
  </div>

  <div mat-dialog-actions align="end">
    <!-- ✅ NOW SAME AS CLOSE BUTTON -->
    <button type="button" mat-button [mat-dialog-close]="false">Cancel</button>

<button type="button"
        mat-raised-button
        color="primary"
        cdkFocusInitial
        [mat-dialog-close]="true">
  Yes
</button>

  </div>
`,

  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
    }
  `]
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private ref: MatDialogRef<ConfirmDialogComponent>
  ) {}

  // ✅ Close without confirming
  close() {
    this.ref.close(false);
  }
}
