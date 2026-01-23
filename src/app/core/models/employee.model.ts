export interface Employee {
  id: number;
  employeeCode: string;
  name: string;
  department?: string;
  role?: string;         // e.g., 'ADMIN' | 'USER'
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;
  
  // ADD THESE TWO FIELDS
  hasAccess: boolean;    // This fixes your filter error
  username?: string;     // Needed for the credentials table display
}