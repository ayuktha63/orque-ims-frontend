import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'MANAGER'
  | 'HR'
  | 'FINANCE'
  | 'EMPLOYEE'
  | 'INTERN';

export interface LoginResponse {
  token: string;
  role: UserRole;
  userId: number;
}

export interface AuthUser {
  id: number;
  role: UserRole;
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
  getRole(): UserRole | '' {
    if (!isPlatformBrowser(this.platformId)) return '';
    return (localStorage.getItem('user_role') as UserRole) || '';
  }

  // ===============================
  // USER OBJECT
  // ===============================
  getUser(): AuthUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const id = localStorage.getItem('user_id');
    const role = localStorage.getItem('user_role') as UserRole;

    if (!id || !role) return null;

    return {
      id: Number(id),
      role
    };
  }

  // ===============================
  // ROLE CHECKS (ALIGNED WITH BACKEND)
  // ===============================

  isSystemAdmin(): boolean {
    return this.getRole() === 'SYSTEM_ADMIN';
  }

  isManager(): boolean {
    return this.getRole() === 'MANAGER';
  }

  isHR(): boolean {
    return this.getRole() === 'HR';
  }

  isFinance(): boolean {
    return this.getRole() === 'FINANCE';
  }

  isEmployee(): boolean {
    return this.getRole() === 'EMPLOYEE';
  }

  isIntern(): boolean {
    return this.getRole() === 'INTERN';
  }

  // ===============================
  // PERMISSION HELPERS
  // ===============================

  canManageEmployees(): boolean {
    return this.isSystemAdmin() || this.isManager() || this.isHR();
  }

  canManageFinance(): boolean {
    return this.isSystemAdmin() || this.isFinance();
  }

  canAccessCredentials(): boolean {
    return this.isSystemAdmin() || this.isHR();
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
      localStorage.clear();
      window.location.href = '/login';
    }
  }
}