import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientService, Client } from '../../../core/services/client.service';
import { ClientUpsertDialogComponent } from '../client-upsert-dialog/client-upsert-dialog.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'contactPerson', 'email', 'phone', 'status', 'createdAt', 'actions'];
  isLoading = true;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    setTimeout(() => {
      this.isLoading = true;
      this.cd.detectChanges();
    });
    
    this.clientService.getAllClients().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.clients = res;
          this.isLoading = false;
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        setTimeout(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        });
        this.snackBar.open('Error loading clients', 'Close', { duration: 3000 });
      }
    });
  }

  getStatusColor(status: string | undefined): string {
    if (status === 'ACTIVE') return 'primary';
    if (status === 'INACTIVE') return 'warn';
    return 'accent'; // PROSPECT
  }

  openClientDialog(client?: Client): void {
    const dialogRef = this.dialog.open(ClientUpsertDialogComponent, {
      width: '600px',
      data: client || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  deleteClient(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.snackBar.open('Client deleted successfully', 'Close', { duration: 3000 });
          this.loadClients();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to delete client', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
