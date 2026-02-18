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
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-finance-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatDialogModule, MatIcon],
  templateUrl: './finance-list.html',
  styleUrls: ['./finance-list.css']
})
export class FinanceListComponent implements OnInit {

  displayedColumns = ['date','type','category','amount','paymentMode','description','actions'];

  minimizedDrafts:any[] = [];

  private refresh$ = new BehaviorSubject<void>(undefined);
  rows$ = this.refresh$.pipe(switchMap(() => this.finance.list()));

  constructor(private finance: FinanceService, private dialog: MatDialog) {}

  ngOnInit(): void {}

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

      if(res === true){
        this.fetchData();
      }

      // ⭐ HANDLE MINIMIZED DRAFT
      if (res?.minimized) {
  setTimeout(() => {
    this.minimizedDrafts = [...this.minimizedDrafts, res.draft];
  });
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
    this.minimizedDrafts.splice(index,1);
    this.openDrawer(draft);
  }

  discardDraft(index:number){
    this.minimizedDrafts.splice(index,1);
  }

  remove(row:FinanceEntry):void{
    if(!row.id) return;

    if(confirm(`Delete entry for ${row.category}?`)){
      this.finance.remove(Number(row.id)).subscribe(()=>this.fetchData());
    }
  }
}
