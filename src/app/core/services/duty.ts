import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
/**
 * Matches your Spring Boot Duty entity response
 */
export interface Duty {
  id?: number;
  jobId?: string;
  title?: string;
  description?: string;
  status?: string;
  assignedTo?: {
    id: number;
    name?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class DutyService {

  private readonly API = `${environment.api}/api/duties`;
  private http = inject(HttpClient);

  // ===============================
  // GET ALL DUTIES (ADMIN)
  // ===============================
  getAll(): Observable<Duty[]> {
    return this.http.get<Duty[]>(this.API);
  }

  // ===============================
  // GET MY WORK (EMPLOYEE)
  // ===============================
  myWork(employeeId: number): Observable<Duty[]> {
    return this.http.get<Duty[]>(`${this.API}/my/${employeeId}`);
  }

  // ===============================
  // CREATE DUTY  (🔥 ADDED)
  // ===============================
  create(payload: Partial<Duty>): Observable<Duty> {
    return this.http.post<Duty>(this.API, payload);
  }

  // ===============================
  // CHANGE STATUS
  // ===============================
  changeStatus(id: number, status: string): Observable<Duty> {
    return this.http.put<Duty>(`${this.API}/${id}/status`, { status });
  }

}
