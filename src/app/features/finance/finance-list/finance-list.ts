import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, switchMap } from 'rxjs';

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
  
  private refresh$ = new BehaviorSubject<void>(undefined);
  rows$ = this.refresh$.pipe(switchMap(() => this.finance.list()));

  constructor(private finance: FinanceService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  fetchData(): void {
    this.refresh$.next();
  }

  private openDrawer(data: FinanceEntry | null): void {
    const ref = this.dialog.open(FinanceUpsertDialogComponent, {
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

  add(): void {
    this.openDrawer(null);
  }

  edit(row: FinanceEntry): void {
    this.openDrawer(row);
  }

  // FIXED METHOD
  remove(row: FinanceEntry): void {
    if (!row.id) return;

    if (confirm(`Delete entry for ${row.category}?`)) {
      // Force the type to number to satisfy the compiler
      const idToDelete = Number(row.id); 
      
      this.finance.remove(idToDelete).subscribe({
        next: () => this.fetchData(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}