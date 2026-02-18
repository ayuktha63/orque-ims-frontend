import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { FinanceService } from '../../../core/services/finance';
import { FinanceEntry } from '../../../core/services/models';
import { FinanceUpsertDialogComponent } from '../finance-upsert-dialog/finance-upsert-dialog';

@Component({
  selector: 'app-finance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './finance-list.html',
  styleUrls: ['./finance-list.css']
})
export class FinanceListComponent {

  displayedColumns = [
    'date','type','category','amount','paymentMode','description','actions'
  ];

  // ✅ REACTIVE DRAFT STORE (FIXES NG0100)
  private draftsSubject = new BehaviorSubject<any[]>([]);
  minimizedDrafts$ = this.draftsSubject.asObservable();

  private refresh$ = new BehaviorSubject<void>(undefined);

  rows$ = this.refresh$.pipe(
    switchMap(() => this.finance.list())
  );

  constructor(
    private finance: FinanceService,
    private dialog: MatDialog
  ) {}

  fetchData(): void {
    this.refresh$.next();
  }

  private openDrawer(data:any): void {

    const ref = this.dialog.open(FinanceUpsertDialogComponent,{
      data,
      panelClass:'right-drawer-dialog',
      position:{right:'0',top:'0'},
      height:'100vh',
      width:'50vw',
      autoFocus:false
    });

    ref.afterClosed().subscribe(res=>{

      // SAVE SUCCESS
      if(res === true){
        this.fetchData();
        return;
      }

      // ✅ MINIMIZED DRAFT (NO NG0100)
      if(res?.minimized){

        const current = this.draftsSubject.value;

        this.draftsSubject.next([
          ...current,
          res.draft
        ]);
      }

    });
  }

  add():void{
    this.openDrawer(null);
  }

  edit(row:FinanceEntry):void{
    this.openDrawer(row);
  }

  restoreDraft(draft:any,index:number){

    const updated = [...this.draftsSubject.value];
    updated.splice(index,1);

    this.draftsSubject.next(updated);

    this.openDrawer(draft);
  }

  discardDraft(index:number){

    const updated = [...this.draftsSubject.value];
    updated.splice(index,1);

    this.draftsSubject.next(updated);
  }

  remove(row:FinanceEntry):void{

    if(!row.id) return;

    if(confirm(`Delete entry for ${row.category}?`)){
      this.finance.remove(Number(row.id))
        .subscribe(()=>this.fetchData());
    }
  }
}
