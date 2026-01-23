export interface FinanceEntry {
  id: number; // Ensure this is ONLY number, not string
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK';
  description: string;
}