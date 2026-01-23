export interface Employee {
  id?: number;           // Backend Generated
  employeeCode?: string; // Backend Generated (EMP0001)
  name: string;
  department?: string;
  role?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;      // YYYY-MM-DD
  createdAt?: string;    // Backend Generated
}