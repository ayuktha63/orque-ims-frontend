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
import { DutyUpsertDialogComponent } from '../duty-upsert-dialog/duty-upsert-dialog';

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

  // ✅ SHOW ALL COLUMNS
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
    private dialog: MatDialog
  ) {}

  openCreateDialog() {
    const ref = this.dialog.open(DutyUpsertDialogComponent, {
      width: '520px',
      data: null
    });

    ref.afterClosed().subscribe(result => {
      if (result) this.refresh$.next();
    });
  }

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex$.next(event.index);
  }

  update(row: Duty, status: string) {
    if (!row.id) return;
    this.service.changeStatus(row.id, status)
      .subscribe(() => this.refresh$.next());
  }
}
