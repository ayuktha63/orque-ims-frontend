import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly API_URL = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  list(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL);
  }

  get(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/${id}`);
  }

  create(data: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, data);
  }

  update(id: number, data: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}