export type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface FinanceEntry {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
  description?: string;
  paymentMode?: 'CASH' | 'UPI' | 'BANK';
}
