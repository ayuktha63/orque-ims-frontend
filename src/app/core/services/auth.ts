import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { username, password }).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('user_role', res.role);
          localStorage.setItem('user_id', res.userId.toString());
        }
      })
    );
  }

  // REQUIRED BY AUTH GUARD
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // REQUIRED BY INTERCEPTOR
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // REQUIRED BY SIDEBAR
  getUserRole(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user_role') || 'USER';
    }
    return 'USER';
  }

  // REQUIRED BY SIDEBAR & PERMISSIONS
  canEdit(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  // REQUIRED BY TOPBAR
  getUser() {
    if (isPlatformBrowser(this.platformId)) {
      const role = this.getUserRole();
      const token = this.getToken();
      return token ? { role } : null;
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }
}