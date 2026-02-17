import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

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
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { username, password })
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
  // 🔥 NEW — ROLE GETTER (STEP 5 REQUIRED)
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
  // ROLES
  // ===============================
  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ROLE_ADMIN' || role === 'ADMIN';
  }

  canEdit(): boolean {
    return this.isAdmin();
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
