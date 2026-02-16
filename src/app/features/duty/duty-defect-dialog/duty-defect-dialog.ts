import { Component } from "@angular/core";
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
  displayedColumns = ["jobId", "issue", "priority", "status"];

  // ⭐ FULL BACKEND URL
  private API = "http://localhost:8080/api/defects";

  form!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
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
    this.loadDefects();
  }

  loadDefects(): void {

    const url = this.auth.canEdit()
      ? `${this.API}`
      : `${this.API}/my`;

    this.http.get<any[]>(url).subscribe({
      next: (res) => this.defects = res,
      error: (err) => console.error("Load defects failed", err)
    });
  }

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
