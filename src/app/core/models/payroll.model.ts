export interface PayrollEntry {
  id: number;
  payrollCode: string;
  month: string;

  employeeId: number;
  employeeCode: string;
  employeeName: string;
  employeeEmail: string;   // ✅ ADDED (Required for EmailJS)

  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;

  notes?: string;
}