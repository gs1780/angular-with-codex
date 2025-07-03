import { Employee } from './employee';

export interface HealthCheckResult {
  connectionString?: string | null;
  canConnect: boolean;
  employees?: Employee[] | null;
  exception?: string | null;
}
