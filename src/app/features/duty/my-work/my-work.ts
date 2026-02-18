import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, switchMap } from 'rxjs';

import { DutyService } from '../../../core/services/duty';
import { AuthService } from '../../../core/services/auth';

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
    MatButtonModule
  ],
  templateUrl: './my-work.html'
})
export class MyWorkComponent {

  // ✅ MUST MATCH HTML matColumnDef EXACTLY
  displayedColumns: string[] = [
    'jobId',
    'title',
    'description',
    'deadline',
    'status',
    'actions'
  ];

  private refresh$ = new BehaviorSubject<void>(undefined);

  rows$ = this.refresh$.pipe(
    switchMap(() => {
      if (this.auth.isAdmin()) {
        return this.service.getAll();
      }
      return this.service.myWork(this.auth.employeeId());
    })
  );

  constructor(
    private service: DutyService,
    public auth: AuthService
  ) {}

  trackById(_: number, row: Duty) {
    return row.id;
  }

  ack(row: Duty){
    this.service.changeStatus(row.id,'ONGOING')
      .subscribe(() => this.refresh$.next());
  }

  finish(row: Duty){
    this.service.changeStatus(row.id,'COMPLETED')
      .subscribe(() => this.refresh$.next());
  }
}
