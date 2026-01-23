import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, switchMap } from 'rxjs';
import { PayrollService } from '../../../core/services/payroll';
import { PayrollEntry } from '../../../core/models/payroll.model';
import { PayrollUpsertDialogComponent } from '../payroll-upsert-dialog/payroll-upsert-dialog';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './payroll-list.html',
  styleUrls: ['./payroll-list.css']
})
export class PayrollListComponent implements OnInit {
  displayedColumns = ['payrollCode', 'month', 'employeeName', 'basic', 'allowances', 'deductions', 'netPay', 'actions'];
  
  private refresh$ = new BehaviorSubject<void>(undefined);
  rows$ = this.refresh$.pipe(switchMap(() => this.payrollService.list()));

  constructor(private payrollService: PayrollService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  fetchData(): void {
    this.refresh$.next();
  }

  private openDrawer(data: PayrollEntry | null): void {
    const ref = this.dialog.open(PayrollUpsertDialogComponent, {
      data,
      panelClass: 'right-drawer-dialog',
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '50vw',
      autoFocus: false
    });

    ref.afterClosed().subscribe(didSave => {
      if (didSave) this.fetchData();
    });
  }

  add(): void { this.openDrawer(null); }
  edit(row: PayrollEntry): void { this.openDrawer(row); }

  remove(row: PayrollEntry): void {
    if (confirm(`Delete payroll ${row.payrollCode}?`) && row.id) {
      this.payrollService.remove(Number(row.id)).subscribe(() => this.fetchData());
    }
  }
}