import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule],
  template: `
    <nav>
      <mat-nav-list>
        <a mat-list-item routerLink="/employees" routerLinkActive="active-link">Employees</a>
        <a mat-list-item routerLink="/departments" routerLinkActive="active-link">Departments</a>
        <a mat-list-item routerLink="/health" routerLinkActive="active-link">Health</a>
      </mat-nav-list>
    </nav>
  `
})
export class SidebarComponent {}
