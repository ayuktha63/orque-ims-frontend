import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FinanceEntry } from './models';

function newId(): string {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private entries$ = new BehaviorSubject<FinanceEntry[]>([
    { id: newId(), type: 'EXPENSE', category: 'Tools', amount: 1200, date: '2026-01-10', description: 'Software subscription', paymentMode: 'UPI' },
    { id: newId(), type: 'INCOME', category: 'Client Payment', amount: 25000, date: '2026-01-12', description: 'Website project', paymentMode: 'BANK' },
    { id: newId(), type: 'EXPENSE', category: 'Travel', amount: 600, date: '2026-01-15', description: 'Client meeting', paymentMode: 'CASH' }
  ]);

  list() {
    return this.entries$.asObservable();
  }

  getSnapshot(): FinanceEntry[] {
    return this.entries$.value;
  }

  add(entry: Omit<FinanceEntry, 'id'>): void {
    const next: FinanceEntry = { ...entry, id: newId() };
    this.entries$.next([next, ...this.entries$.value]);
  }

  update(id: string, patch: Partial<FinanceEntry>): void {
    const updated = this.entries$.value.map(e => (e.id === id ? { ...e, ...patch } : e));
    this.entries$.next(updated);
  }

  remove(id: string): void {
    this.entries$.next(this.entries$.value.filter(e => e.id !== id));
  }

  summaryForMonth(yyyyMM: string): { income: number; expense: number; profit: number; count: number } {
    const items = this.entries$.value.filter(e => e.date.startsWith(yyyyMM));
    const income = items.filter(i => i.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const expense = items.filter(i => i.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    return { income, expense, profit: income - expense, count: items.length };
  }
}
