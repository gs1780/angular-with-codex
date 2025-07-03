import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private apiUrl = `${environment.apiBaseUrl}/api/departments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  add(department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  update(id: string, department: Department): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, department);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
