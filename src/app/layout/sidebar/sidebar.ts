import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, Observable } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  menu$: Observable<MenuItem[]>;

  constructor(private http: HttpClient) {
    this.menu$ = this.http.get<MenuItem[]>('assets/config/menu.json').pipe(
      catchError(() =>
        of<MenuItem[]>([
          { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
          { label: 'Finance', icon: 'paid', route: '/app/finance' },
          { label: 'Invoices', icon: 'receipt_long', route: '/app/invoices' },
          { label: 'Clients', icon: 'groups', route: '/app/clients' }
        ])
      )
    );
  }
}
