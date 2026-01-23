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

  add(): void {
    this.dialog.open(FinanceUpsertDialogComponent, { width: '520px', data: null });
  }

  edit(row: FinanceEntry): void {
    this.dialog.open(FinanceUpsertDialogComponent, { width: '520px', data: row });
  }

  remove(row: FinanceEntry): void {
    this.finance.remove(row.id);
  }
}
