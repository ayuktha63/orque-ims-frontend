import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { AuthUser } from './models';

const TOKEN_KEY = 'orque_token';
const USER_KEY = 'orque_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private user$ = new BehaviorSubject<AuthUser | null>(this.loadUser());
  currentUser$ = this.user$.asObservable();

  login(email: string, password: string): boolean {
    // MOCK AUTH (replace with API later)
    const user: AuthUser = {
      id: 'u-1',
      name: 'Orque Admin',
      email,
      role: 'ADMIN'
    };

    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, 'mock-jwt-token');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    this.user$.next(user);
    return true;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.user$.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    return this.user$.value;
  }

  private loadUser(): AuthUser | null {
    if (!this.isBrowser) return null;

    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
