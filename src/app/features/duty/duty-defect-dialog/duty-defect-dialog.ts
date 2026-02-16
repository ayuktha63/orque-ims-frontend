import { Component, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";

import { AuthService } from "../../../core/services/auth";

@Component({
  standalone: true,
  selector: "app-duty-defect-dialog",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule
  ],
  templateUrl: "./duty-defect-dialog.html",
  styleUrls: ["./duty-defect-dialog.css"]
})
export class DutyDefectDialogComponent {

  // ⭐ THREE DATASETS NOW
  myRaisedDefects: any[] = [];
  myAssignedDefects: any[] = [];
  jobs: any[] = [];

  displayedColumns = ["jobId", "issue", "status"];

  private API = "http://localhost:8080/api/defects";
  private JOB_API = "http://localhost:8080/api/duties";

  form!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public auth: AuthService
  ) {
    this.form = this.fb.group({
      jobId: ["", Validators.required],
      issue: ["", Validators.required],
      priority: ["MEDIUM"],
      status: ["OPEN"]
    });
  }

  ngOnInit(): void {
    this.loadJobs();
    this.loadMyRaised();
    this.loadAssigned();
  }

  // ================= LOAD JOB DROPDOWN =================
  loadJobs(): void {
    this.http.get<any[]>(this.JOB_API).subscribe({
      next: (res) => {
        this.jobs = res;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= MY RAISED DEFECTS =================
  loadMyRaised(): void {
    this.http.get<any[]>(`${this.API}/my`).subscribe({
      next: (res) => {
        this.myRaisedDefects = res;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= ASSIGNED DEFECTS =================
  loadAssigned(): void {
    this.http.get<any[]>(`${this.API}/assigned`).subscribe({
      next: (res) => {
        this.myAssignedDefects = res;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ================= CREATE DEFECT =================
  save(): void {

    if (this.form.invalid) return;

    this.http.post(this.API, this.form.value)
      .subscribe({
        next: () => {
          this.form.reset({
            priority: "MEDIUM",
            status: "OPEN"
          });

          // reload both lists
          this.loadMyRaised();
          this.loadAssigned();
        },
        error: (err) => console.error(err)
      });
  }
}
