export interface Credential {
  id?: number;
  employeeId: number;
  username: string;
  password?: string;     // Optional for updates
  role: 'ADMIN' | 'USER';
}