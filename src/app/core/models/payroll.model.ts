export interface PayrollEntry {
  id: number;
  payrollCode: string;
  month: string;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
  notes?: string;
}