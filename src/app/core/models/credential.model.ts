export interface Credential {
  id?: number;
  employeeId: number;
  username: string;
  password?: string;   // Optional for updates
  role: 
    | 'SYSTEM_ADMIN'
    | 'MANAGER'
    | 'HR'
    | 'FINANCE'
    | 'EMPLOYEE'
    | 'INTERN';
}