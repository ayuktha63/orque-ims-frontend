import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
@Injectable({ providedIn: 'root' })
export class CredentialService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.api}/api/credentials`;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // FIX: Added { responseType: 'text' } to handle the string response from Spring Boot
  upsert(payload: any): Observable<string> {
    return this.http.post(this.API_URL, payload, { responseType: 'text' });
  }
}