import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  invoiceOpen = false;

  constructor(public auth: AuthService) {}

  // ⭐ ADD THESE HELPERS
  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  isEmployee(): boolean {
    return !this.auth.isAdmin();
  }

  toggleInvoice(event: MouseEvent) {
    event.stopPropagation();
    this.invoiceOpen = !this.invoiceOpen;
  }

  closeInvoice() {
    this.invoiceOpen = false;
  }
}

