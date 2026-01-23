import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, switchMap } from 'rxjs';

import { EmployeeService } from '../../../core/services/employees';
import { Employee } from '../../../core/models/employee.model';
import { AuthService } from '../../../core/services/auth'; // 1. Import Auth
import { EmployeeUpsertDialogComponent } from '../employee-upsert-dialog/employee-upsert-dialog';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns = ['employeeCode', 'name', 'department', 'role', 'status', 'actions'];
  
  // 2. Use a BehaviorSubject trigger for more robust data refreshing
  private refresh$ = new BehaviorSubject<void>(undefined);
  rows$ = this.refresh$.pipe(switchMap(() => this.service.list()));

  constructor(
    private dialog: MatDialog,
    private service: EmployeeService,
    public auth: AuthService // 3. Inject as public for HTML access
  ) {}

  ngOnInit(): void {}

  fetchData(): void {
    this.refresh$.next();
  }

  private openDrawer(data: Employee | null): void {
    const ref = this.dialog.open(EmployeeUpsertDialogComponent, {
      data,
      panelClass: 'right-drawer-dialog',
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '50vw',
      autoFocus: false
    });

    ref.afterClosed().subscribe((didSave: boolean) => {
      if (didSave) {
        this.fetchData(); 
      }
    });
  }

  add(): void {
    // 4. Guard the Add action
    if (this.auth.canEdit()) {
      this.openDrawer(null);
    }
  }

  edit(row: Employee): void {
    // Admins "Edit", Employees "View" - the same dialog handles both
    this.openDrawer(row);
  }

  remove(row: Employee): void {
    // 5. Strictly guard the Delete action
    if (this.auth.canEdit() && confirm(`Are you sure you want to delete ${row.name}?`) && row.id) {
      this.service.delete(row.id).subscribe({
        next: () => this.fetchData(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}