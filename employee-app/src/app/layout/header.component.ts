import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `<header><mat-toolbar color="primary">Employee App</mat-toolbar></header>`
})
export class HeaderComponent {}
