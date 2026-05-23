import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';

import { DutyService, Duty } from '../../../core/services/duty';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast.service';

import { DutyUpsertDialogComponent } from '../duty-upsert-dialog/duty-upsert-dialog';
import { ConfirmDialogComponent } from '../my-work/confirm-dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-duty-list',
imports: [
  CommonModule,
  MatTableModule,
  MatTabsModule,
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatDatepickerModule,   // ✅ add
  MatNativeDateModule    // ✅ add (THIS FIXES DateAdapter)
],
  templateUrl: './duty-list.html',
  styles: [`.full { width: 100%; }`]
})
export class DutyListComponent {

  displayedColumns = [
    'jobId',
    'title',
    'description',
    'deadline',
    'employee',
    'status',
    'actions'
  ];

  private refresh$ = new BehaviorSubject<void>(undefined);
  private tabIndex$ = new BehaviorSubject<number>(0);

  constructor(
    private service: DutyService,
    public auth: AuthService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {}

  // ✅ PUBLIC (Template can access)
  canManageDuties(): boolean {
    const role = this.auth.getRole();
    return role === 'SYSTEM_ADMIN' ||
           role === 'MANAGER' ||
           role === 'HR';
  }

  rows$ = combineLatest([
    this.refresh$.pipe(
      switchMap(() =>
        this.canManageDuties()
          ? this.service.getAll()
          : this.service.myWork(this.auth.employeeId())
      )
    ),
    this.tabIndex$
  ]).pipe(
    map(([list, index]) => {
      const statuses = [
        'PENDING_APPROVAL',
        'ASSIGNED',
        'ONGOING',
        'COMPLETED'
      ];
      return (list || []).filter(d => d.status === statuses[index]);
    })
  );

  openCreateDialog() {
    if (!this.canManageDuties()) {
      this.toast.error('Permission denied');
      return;
    }

    this.dialog.open(DutyUpsertDialogComponent, {
      width: '520px',
      data: null
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex$.next(event.index);
  }

  update(row: Duty, status: string) {

    if (!row.id) return;

    if (status === 'ASSIGNED' && !this.canManageDuties()) {
      this.toast.error('Permission denied');
      return;
    }

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: { message: `${status} duty ${row.jobId}?` }
    });

    ref.afterClosed().subscribe(ok => {
      if (!ok) return;

      this.service.changeStatus(row.id!, status)
        .subscribe(() => this.refresh$.next());
    });
  }
}