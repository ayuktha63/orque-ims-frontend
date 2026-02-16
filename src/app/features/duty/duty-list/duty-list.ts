import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { DutyService, Duty } from '../../../core/services/duty';
import { AuthService } from '../../../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-duty-list',
  imports: [CommonModule, MatTableModule, MatTabsModule, MatCardModule, MatButtonModule],
  templateUrl: './duty-list.html',
  styles: [`.full { width: 100%; }`]
})
export class DutyListComponent {
  displayedColumns = ['jobId', 'title', 'employee', 'status', 'actions'];
  
  private refresh$ = new BehaviorSubject<void>(undefined);
  private tabIndex$ = new BehaviorSubject<number>(0);

  // The critical logic: Filter the list based on the active tab index
  rows$ = combineLatest([
    this.refresh$.pipe(
      switchMap(() => this.auth.isAdmin() ? this.service.getAll() : this.service.myWork(this.auth.employeeId()))
    ),
    this.tabIndex$
  ]).pipe(
    map(([list, index]) => {
      const statuses = ['PENDING_APPROVAL', 'ASSIGNED', 'ONGOING', 'COMPLETED'];
      const targetStatus = statuses[index];
      return (list || []).filter(d => d.status === targetStatus);
    })
  );

  constructor(private service: DutyService, public auth: AuthService) {}

  onTabChange(event: MatTabChangeEvent) {
    this.tabIndex$.next(event.index);
  }

  update(row: Duty, status: string) {
    if (!row.id) return;
    this.service.changeStatus(row.id, status).subscribe(() => this.refresh$.next());
  }
}