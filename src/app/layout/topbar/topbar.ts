import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {
  // Using inject() for cleaner initialization in standalone components
  public auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    // Clear local data via service
    this.auth.logout();
    
    // Use the router to navigate back to login
    // Note: If your AuthService already uses window.location.href, 
    // this line might be redundant, but it's safe to keep for SPA navigation.
    this.router.navigateByUrl('/login');
  }
}