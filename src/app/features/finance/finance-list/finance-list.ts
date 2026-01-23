import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FinanceService } from '../../../core/services/finance';
import { FinanceEntry } from '../../../core/services/models';
import { FinanceUpsertDialogComponent } from '../finance-upsert-dialog/finance-upsert-dialog';

@Component({
  selector: 'app-finance-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './finance-list.html',
  styleUrls: ['./finance-list.css']
})
export class FinanceListComponent implements OnInit {
  displayedColumns = ['date', 'type', 'category', 'amount', 'paymentMode', 'description', 'actions'];
  rows: FinanceEntry[] = [];

  constructor(private finance: FinanceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.finance.list().subscribe(items => (this.rows = items));
  }

  private openDrawer(data: FinanceEntry | null): void {
    this.dialog.open(FinanceUpsertDialogComponent, {
      data,
      panelClass: 'right-drawer-dialog',
      hasBackdrop: true,
      autoFocus: false,
      restoreFocus: false,
      position: { right: '0', top: '0' },
      height: '100vh',

      // choose ONE width style:
      width: '50vw',       // drawer up to mid screen
      maxWidth: '100vw'
      // OR fixed:
      // width: '520px',
    });
  }

  add(): void {
    this.openDrawer(null);
  }

  edit(row: FinanceEntry): void {
    this.openDrawer(row);
  }

  remove(row: FinanceEntry): void {
    this.finance.remove(row.id);
  }
}
