import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Settings {
  id?: number;
  employeeId: string;
  configJson: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = `${environment.api}/api/settings`;

  constructor(private http: HttpClient) { }

  getSettings(employeeId: string): Observable<Settings> {
    return this.http.get<Settings>(`${this.apiUrl}/${employeeId}`);
  }

  saveSettings(employeeId: string, configJson: string): Observable<Settings> {
    return this.http.post<Settings>(`${this.apiUrl}/${employeeId}`, { configJson });
  }
}
