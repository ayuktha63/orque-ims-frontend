import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, switchMap } from 'rxjs';

import { DutyService } from '../../../core/services/duty';
import { AuthService } from '../../../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-my-work',
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './my-work.html'
})
export class MyWorkComponent {

  // ✅ MUST match matColumnDef names
  displayedColumns: string[] = ['jobId','title','status','actions'];

  private refresh$ = new BehaviorSubject<void>(undefined);

  // ✅ datasource stream — RETURNS Duty[]
  rows$ = this.refresh$.pipe(
    switchMap(() => {

      // ADMIN → get all duties
      if (this.auth.isAdmin()) {
        return this.service.getAll();
      }

      // EMPLOYEE → only own duties
      return this.service.myWork(this.auth.employeeId());
    })
  );

  constructor(
    private service: DutyService,
    public auth: AuthService
  ) {}

  ack(row:any){
    this.service.changeStatus(row.id,'ONGOING')
      .subscribe(() => this.refresh$.next());
  }

  finish(row:any){
    this.service.changeStatus(row.id,'COMPLETED')
      .subscribe(() => this.refresh$.next());
  }
}
