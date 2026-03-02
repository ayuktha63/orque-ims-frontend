import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface LoginResponse {
  token: string;
  role: string;
  userId: number;
}

export interface AuthUser {
  id: number;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = `${environment.api}/api/auth`;
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  // ===============================
  // LOGIN
  // ===============================
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap(res => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('user_role', res.role);
            localStorage.setItem('user_id', String(res.userId));
          }
        })
      );
  }

  // ===============================
  // TOKEN
  // ===============================
  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('auth_token')
      : null;
  }

  // ===============================
  // LOGIN CHECK
  // ===============================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ===============================
  // ROLE GETTER
  // ===============================
  getRole(): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return localStorage.getItem('user_role') || '';
  }

  // ===============================
  // USER OBJECT
  // ===============================
  getUser(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const id = localStorage.getItem('user_id');
    const role = localStorage.getItem('user_role');

    if (!id || !role) return null;

    return {
      id: Number(id),
      role
    };
  }

  // ===============================
  // ROLE CHECKS
  // ===============================

  isSystemAdmin(): boolean {
    return this.getRole() === 'SYSTEM_ADMIN';
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN' || role === 'SYSTEM_ADMIN';
  }

  isHR(): boolean {
    return this.getRole() === 'HR';
  }

  isFinance(): boolean {
    return this.getRole() === 'FINANCE';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }

  // ===============================
  // PERMISSION HELPERS
  // ===============================

  canEdit(): boolean {
    const role = this.getRole();
    return role === 'SYSTEM_ADMIN' ||
           role === 'ADMIN' ||
           role === 'HR' ||
           role === 'FINANCE';
  }

  employeeId(): number {
    const id = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('user_id')
      : null;

    return id ? Number(id) : 0;
  }

  // ===============================
  // LOGOUT
  // ===============================
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    }
  }
}