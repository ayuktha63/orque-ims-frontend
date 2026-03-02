import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, switchMap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DutyService } from '../../../core/services/duty';
import { AuthService } from '../../../core/services/auth';
import { ConfirmDialogComponent } from './confirm-dialog';

export interface Duty {
  id: number;
  jobId: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

@Component({
  standalone: true,
  selector: 'app-my-work',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './my-work.html'
})
export class MyWorkComponent {

  displayedColumns: string[] = [
    'jobId',
    'title',
    'description',
    'deadline',
    'status',
    'actions'
  ];

  private refresh$ = new BehaviorSubject<void>(undefined);

  // ==============================
  // ROLE CHECK
  // ==============================
  private canViewAll(): boolean {
    const role = this.auth.getRole();
    return role === 'SYSTEM_ADMIN' ||
           role === 'MANAGER' ||
           role === 'HR';
  }

  // ==============================
  // DATA SOURCE
  // ==============================
  rows$ = this.refresh$.pipe(
    switchMap(() =>
      this.canViewAll()
        ? this.service.getAll()
        : this.service.myWork(this.auth.employeeId())
    )
  );

  constructor(
    private service: DutyService,
    public auth: AuthService,
    private dialog: MatDialog
  ) {}

  trackById(_: number, row: Duty) {
    return row.id;
  }

  // ==============================
  // START WORK
  // ==============================
  ack(row: Duty) {

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: { message: `Start work for ${row.jobId}?` }
    });

    ref.afterClosed().subscribe(ok => {

      if (!ok) return;

      this.service.changeStatus(row.id, 'ONGOING')
        .subscribe(() => this.refresh$.next());
    });
  }

  // ==============================
  // FINISH WORK
  // ==============================
  finish(row: Duty) {

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: { message: `Mark ${row.jobId} as completed?` }
    });

    ref.afterClosed().subscribe(ok => {

      if (!ok) return;

      this.service.changeStatus(row.id, 'COMPLETED')
        .subscribe(() => this.refresh$.next());
    });
  }

}