import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, switchMap } from 'rxjs';

import { CredentialService } from '../../../core/services/credential';
import { CredentialUpsertDialogComponent } from '../credential-upsert-dialog/credential-upsert-dialog';

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './credentials.html',
  styleUrls: ['./credentials.css']
})
export class CredentialsComponent implements OnInit {

  displayedColumns = ['employeeCode', 'name', 'username', 'password', 'role', 'actions'];

  private refresh$ = new BehaviorSubject<void>(undefined);

  authorizedEmployees$ = this.refresh$.pipe(
    switchMap(() => this.credentialService.getAll())
  );

  constructor(
    private credentialService: CredentialService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.refresh$.next();
  }

  manageCredentials(employee: any): void {

    const dialogRef = this.dialog.open(CredentialUpsertDialogComponent, {
      data: { employee },
      panelClass: 'right-drawer-dialog',
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData(); // dialog already handled toast
      }
    });
  }
}