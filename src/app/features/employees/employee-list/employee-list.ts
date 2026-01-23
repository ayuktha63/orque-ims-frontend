import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs'; // Import Observable

import { EmployeeService } from '../../../core/services/employees';
import { Employee } from '../../../core/models/employee.model';
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
  
  // Use an Observable instead of a raw array to fix the NG0100 error
  rows$!: Observable<Employee[]>;

  constructor(
    private dialog: MatDialog,
    private service: EmployeeService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    // Assign the stream directly. The 'async' pipe in HTML handles the rest.
    this.rows$ = this.service.list();
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
    this.openDrawer(null);
  }

  edit(row: Employee): void {
    this.openDrawer(row);
  }

  remove(row: Employee): void {
    if (confirm(`Are you sure you want to delete ${row.name}?`) && row.id) {
      this.service.delete(row.id).subscribe({
        next: () => this.fetchData(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}