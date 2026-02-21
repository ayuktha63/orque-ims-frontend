import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { DutyService, Duty } from '../../../core/services/duty';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast.service'; // ✅ ADD

import { DutyUpsertDialogComponent } from '../duty-upsert-dialog/duty-upsert-dialog';
import { ConfirmDialogComponent } from '../my-work/confirm-dialog';

@Component({
  standalone: true,
  selector: 'app-duty-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
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

  rows$ = combineLatest([
    this.refresh$.pipe(
      switchMap(() =>
        this.auth.isAdmin()
          ? this.service.getAll()
          : this.service.myWork(this.auth.employeeId())
      )
    ),
    this.tabIndex$
  ]).pipe(
    map(([list, index]) => {
      const statuses = ['PENDING_APPROVAL', 'ASSIGNED', 'ONGOING', 'COMPLETED'];
      const targetStatus = statuses[index];
      return (list || []).filter(d => d.status === targetStatus);
    })
  );

  constructor(
    private service: DutyService,
    public auth: AuthService,
    private dialog: MatDialog,
    private toast: ToastService   // ✅ INJECT
  ) {}

  // ==============================
  // CREATE DUTY
  // ==============================
  openCreateDialog() {
    const ref = this.dialog.open(DutyUpsertDialogComponent, {
      width: '520px',
      data: null
    });

  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex$.next(event.index);
  }

  // ==============================
  // GLOBAL CONFIRMATION HANDLER
  // ==============================
  private confirmAndUpdate(row: Duty, status: string, message: string) {

    if (!row.id) return;

    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: { message }
    });

    ref.afterClosed().subscribe(ok => {

      if (!ok) {
        this.toast.info('Action cancelled');   // ✅ OPTIONAL UX
        return;
      }

      this.service.changeStatus(row.id!, status)
        .subscribe({

          next: (res: any) => {

            // ==========================
            // SUCCESS MESSAGE HANDLING
            // ==========================
            if (status === 'ASSIGNED') {
              this.toast.success(res?.message || 'Duty approved');
            }

            else if (status === 'ONGOING') {
              this.toast.info(res?.message || 'Duty started');
            }

            else if (status === 'COMPLETED') {
              this.toast.success(res?.message || 'Duty completed');
            }

            this.refresh$.next();
          },

          error: (err) => {

            const msg =
              err?.error?.message ||
              err?.message ||
              'Failed to update duty';

            this.toast.error(msg);   // ✅ ERROR TOAST
          }

        });
    });
  }

  // ==============================
  // ACTION WRAPPER
  // ==============================
  update(row: Duty, status: string) {

    if (status === 'ASSIGNED') {
      this.confirmAndUpdate(row, status, `Approve duty ${row.jobId}?`);
    }

    else if (status === 'ONGOING') {
      this.confirmAndUpdate(row, status, `Start duty ${row.jobId}?`);
    }

    else if (status === 'COMPLETED') {
      this.confirmAndUpdate(row, status, `Finish duty ${row.jobId}?`);
    }
  }

}