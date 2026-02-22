import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Employee {
  id?: number;
  employeeCode?: string;
  name: string;
  department?: string;
  role?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly API_URL = `${environment.api}/api/employees`;

  // cache observable
  private employees$?: Observable<Employee[]>;

  constructor(private http: HttpClient) {}

  /**
   * LIST EMPLOYEES
   * Uses caching to prevent multiple API hits
   */
  list(forceRefresh = false): Observable<Employee[]> {
    if (!this.employees$ || forceRefresh) {
      this.employees$ = this.http.get<Employee[]>(this.API_URL).pipe(
        shareReplay(1) // 🔥 cache last response
      );
    }
    return this.employees$;
  }

  /**
   * GET SINGLE EMPLOYEE
   */
  get(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/${id}`);
  }

  /**
   * CREATE EMPLOYEE
   */
  create(data: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, data).pipe(
      tap(() => this.invalidateCache())
    );
  }

  /**
   * UPDATE EMPLOYEE
   */
  update(id: number, data: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.API_URL}/${id}`, data).pipe(
      tap(() => this.invalidateCache())
    );
  }

  /**
   * DELETE EMPLOYEE
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.invalidateCache())
    );
  }

  /**
   * Clear cached employee list
   */
  private invalidateCache() {
    this.employees$ = undefined;
  }
}