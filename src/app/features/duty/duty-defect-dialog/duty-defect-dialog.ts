import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@Component({
  standalone: true,
  selector: 'app-duty-defect-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ],
  template: `

  <h2 mat-dialog-title>Raise Defect</h2>

  <div mat-dialog-content class="content">

    <mat-form-field class="full">
      <mat-label>Job ID</mat-label>
      <input matInput [value]="data?.jobId" readonly>
    </mat-form-field>

    <mat-form-field class="full">
      <mat-label>Issue</mat-label>
      <textarea matInput [(ngModel)]="issue" rows="4"></textarea>
    </mat-form-field>

  </div>

  <div mat-dialog-actions align="end">
    <button mat-stroked-button (click)="ref.close()">Cancel</button>
    <button mat-raised-button color="primary" (click)="save()">Submit</button>
  </div>

  `,
  styles:[`
    .content{
      display:flex;
      flex-direction:column;
      gap:12px;
      margin-top:10px;
    }
    .full{ width:100%; }
  `]
})
export class DutyDefectDialogComponent {

  issue = '';

  constructor(
    private http: HttpClient,
    public ref: MatDialogRef<DutyDefectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}

  save(): void {

    if(!this.issue?.trim()) return;

    this.http.post('/api/defects',{
      jobId: this.data?.jobId,
      issue: this.issue,
      status:'OPEN'
    }).subscribe({
      next:()=> this.ref.close(true),
      error:(err)=> console.error('Defect create failed',err)
    });
  }
}
