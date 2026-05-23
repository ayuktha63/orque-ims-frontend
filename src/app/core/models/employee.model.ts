export interface Employee {
  id: number;
  employeeCode: string;
  name: string;

  department?: string;
  role?: string;

  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;

  email: string;        // ✅ ADDED (Matches backend)

  hasAccess: boolean;
  username?: string;
}