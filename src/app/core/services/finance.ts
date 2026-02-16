import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { FinanceEntry } from './models';
import { environment } from '../../../environment/environment';
@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly API_URL = `${environment.api}/api/finance`;

  constructor(private http: HttpClient) {}

  list(): Observable<FinanceEntry[]> {
    return this.http.get<FinanceEntry[]>(this.API_URL);
  }

  add(entry: any): Observable<FinanceEntry> {
    return this.http.post<FinanceEntry>(this.API_URL, entry);
  }

  update(id: number, patch: any): Observable<FinanceEntry> {
    return this.http.put<FinanceEntry>(`${this.API_URL}/${id}`, patch);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  summaryForMonth(yyyyMM: string): Observable<{ income: number; expense: number; profit: number; count: number }> {
    return this.list().pipe(
      map(entries => {
        const items = entries.filter(e => e.date.startsWith(yyyyMM));
        const income = items.filter(i => i.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
        const expense = items.filter(i => i.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
        return { income, expense, profit: income - expense, count: items.length };
      })
    );
  }
}