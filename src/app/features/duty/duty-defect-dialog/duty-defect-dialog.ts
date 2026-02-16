import { Component, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";

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
    MatTableModule
  ],
  templateUrl: "./duty-defect-dialog.html",
  styleUrls: ["./duty-defect-dialog.css"]
})
export class DutyDefectDialogComponent {

  defects: any[] = [];
  jobs: any[] = [];

  displayedColumns = ["jobId", "issue", "priority", "status"];

  private API = "http://localhost:8080/api/defects";
  private JOB_API = "http://localhost:8080/api/duties"; // ⭐ using duties

  form!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,   // ⭐ FIX FOR NG0100
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
    this.loadDefects();
  }

  // ================= LOAD DUTIES =================
  loadJobs(): void {
    this.http.get<any[]>(this.JOB_API).subscribe({
      next: (res) => {
        this.jobs = res;
        this.cd.detectChanges(); // ⭐ PREVENT NG0100 ERROR
      },
      error: (err) => console.error("Load duties failed", err)
    });
  }

  // ================= LOAD DEFECTS =================
  loadDefects(): void {

    const url = this.auth.canEdit()
      ? `${this.API}`
      : `${this.API}/my`;

    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.defects = res;
        this.cd.detectChanges(); // ⭐ SAFE UPDATE
      },
      error: (err) => console.error("Load defects failed", err)
    });
  }

  // ================= SAVE DEFECT =================
  save(): void {

    if (this.form.invalid) return;

    this.http.post(this.API, this.form.value)
      .subscribe({
        next: () => {
          this.form.reset({
            priority: "MEDIUM",
            status: "OPEN"
          });
          this.loadDefects();
        },
        error: (err) => console.error("Defect create failed", err)
      });
  }
}
