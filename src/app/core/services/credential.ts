import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface representing the Credential DTO from your backend.
 * hasAccess is the boolean used to trigger the red row highlighting.
 */
export interface Credential {
  id?: number;
  employeeId: number;
  username: string;
  password?: string;
  role: 'ADMIN' | 'USER';
  hasAccess?: boolean;
  name?: string;
  employeeCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  // Use the inject() function correctly for HttpClient
  private http = inject(HttpClient);
  
  // Your Spring Boot API endpoint
  private readonly API_URL = 'http://localhost:8080/api/credentials';

  /**
   * Fetches the full list of employees and their credential status.
   * This is the data source for your mat-table.
   */
  getAll(): Observable<Credential[]> {
    return this.http.get<Credential[]>(this.API_URL);
  }

  /**
   * Sends the payload to create or update an employee's login.
   * Matches the @PostMapping in your CredentialController.
   */
  upsert(credential: any): Observable<any> {
    return this.http.post<any>(this.API_URL, credential);
  }
}