import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
@Injectable({ providedIn: 'root' })
export class ApiService {
  baseUrl = environment.api;
  constructor(public http: HttpClient) {}
}
