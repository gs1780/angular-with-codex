import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../services/health.service';
import { HealthCheckResult } from '../models/health-check-result';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {
  displayedColumns = ['connectionString', 'canConnect', 'exception'];
  dataSource: HealthCheckResult[] = [];

  constructor(private service: HealthService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getStatus().subscribe({
      next: data => (this.dataSource = [data]),
      error: err => console.error(err)
    });
  }

  exportExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Health');
    XLSX.writeFile(workbook, 'health.xlsx');
  }
}
