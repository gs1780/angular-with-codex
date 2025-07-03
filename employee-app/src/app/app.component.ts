import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees/employees.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
