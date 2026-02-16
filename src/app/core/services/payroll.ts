import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayrollEntry } from '../models/payroll.model'; // Correct path
import { environment } from '../../../environment/environment';
@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly API_URL = `${environment.api}/api/payroll`;
  constructor(private http: HttpClient) {}

  list(): Observable<PayrollEntry[]> { return this.http.get<PayrollEntry[]>(this.API_URL); }
  add(entry: any): Observable<PayrollEntry> { return this.http.post<PayrollEntry>(this.API_URL, entry); }
  update(id: number, patch: any): Observable<PayrollEntry> { return this.http.put<PayrollEntry>(`${this.API_URL}/${id}`, patch); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.API_URL}/${id}`); }
}