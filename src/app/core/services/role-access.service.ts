import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface RoleAccess {
  id?: number;
  roleName: string;
  accessConfigJson: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {

  private apiUrl = `${environment.api}/api/roles`;

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<RoleAccess[]> {
    return this.http.get<RoleAccess[]>(this.apiUrl);
  }

  getRoleByName(roleName: string): Observable<RoleAccess> {
    return this.http.get<RoleAccess>(`${this.apiUrl}/${roleName}`);
  }

  createOrUpdateRole(role: RoleAccess): Observable<RoleAccess> {
    return this.http.post<RoleAccess>(this.apiUrl, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
