import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private apiUrl = `${environment.apiBaseUrl}/api/employees`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  add(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  update(employeeID: number, employee: Employee): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${employeeID}`, employee);
  }

  delete(employeeID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeeID}`);
  }
}
