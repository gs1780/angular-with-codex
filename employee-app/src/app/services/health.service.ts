import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HealthCheckResult } from '../models/health-check-result';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private apiUrl = `${environment.apiBaseUrl}/api/Health`;

  constructor(private http: HttpClient) {}

  getStatus(): Observable<HealthCheckResult> {
    return this.http.get<HealthCheckResult>(this.apiUrl);
  }
}
