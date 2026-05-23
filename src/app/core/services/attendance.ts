import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Leave';
  employeeId: string;
  employeeName: string;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {

  private readonly API_URL = `${environment.api}/api/attendance`;
  private recordsSubject = new BehaviorSubject<AttendanceRecord[]>([]);

  constructor(private http: HttpClient) { }

  fetchRecords(): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(this.API_URL).pipe(
      tap(records => this.recordsSubject.next(records))
    );
  }

  getRecords(): Observable<AttendanceRecord[]> {
    return this.recordsSubject.asObservable();
  }

  setRecord(date: string, employeeId: string, employeeName: string, status: 'Present' | 'Leave' | null): Observable<any> {
    if (status) {
      const payload = { date, employeeId, employeeName, status };
      return this.http.post<AttendanceRecord>(this.API_URL, payload).pipe(
        tap(() => this.fetchRecords().subscribe())
      );
    } else {
      return this.http.delete(`${this.API_URL}/${employeeId}/${date}`).pipe(
        tap(() => this.fetchRecords().subscribe())
      );
    }
  }
}
