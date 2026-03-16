import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AttendanceDialogData {
  employeeName: string;
  date: string;
  currentStatus: 'Present' | 'Leave' | null;
}

@Component({
  selector: 'app-attendance-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Set Attendance</h2>
    <mat-dialog-content>
      <p>Select attendance status for <strong>{{ data.employeeName }}</strong> on <strong>{{ data.date }}</strong>:</p>
      
      <div class="status-options">
        <button mat-stroked-button class="opt-btn present" [class.selected]="data.currentStatus === 'Present'" (click)="select('Present')">
          <mat-icon>check_circle</mat-icon> Present
        </button>
        <button mat-stroked-button class="opt-btn leave" [class.selected]="data.currentStatus === 'Leave'" (click)="select('Leave')">
          <mat-icon>event_busy</mat-icon> Leave
        </button>
        <button mat-stroked-button color="warn" class="opt-btn clear" *ngIf="data.currentStatus" (click)="select(null)">
          <mat-icon>clear</mat-icon> Clear Status
        </button>
      </div>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .status-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;
      margin-bottom: 8px;
    }
    .opt-btn {
      height: 48px;
      display: flex;
      justify-content: flex-start;
      padding: 0 16px;
      border-radius: 8px;
    }
    .opt-btn.present { border-color: #4caf50; color: #4caf50; }
    .opt-btn.present.selected { background: #e8f5e9; border-width: 2px; }
    
    .opt-btn.leave { border-color: #ff9800; color: #ff9800; }
    .opt-btn.leave.selected { background: #fff3e0; border-width: 2px; }
  `]
})
export class AttendanceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttendanceDialogData
  ) {}

  select(status: 'Present' | 'Leave' | null) {
    this.dialogRef.close(status);
  }
}
