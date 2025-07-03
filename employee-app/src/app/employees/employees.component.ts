import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../services/employees.service';
import { Employee } from '../models/employee';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, AfterViewInit {
  displayedColumns = ['employeeID', 'name', 'doj', 'department', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  search = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: EmployeesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
    this.search.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.dataSource.filter = (value || '').trim().toLowerCase();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  load(): void {
    this.service.getAll().subscribe({
      next: data => (this.dataSource.data = data),
      error: err => console.error(err)
    });
  }

  openAdd(): void {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.add(result).subscribe(() => this.load());
      }
    });
  }

  openEdit(emp: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '400px',
      data: { ...emp }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.update(emp.employeeID!, result).subscribe(() => this.load());
      }
    });
  }

  delete(emp: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Delete employee?'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.delete(emp.employeeID!).subscribe(() => this.load());
      }
    });
  }

  importExcel(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Employee[] = XLSX.utils.sheet_to_json(sheet);
      rows.forEach(row => {
        this.service.add(row).subscribe(() => this.load());
      });
    };
    reader.readAsArrayBuffer(file);
  }

  exportExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
  }
}

@Component({
  selector: 'employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './employee-dialog.html'
})
export class EmployeeDialog {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      doj: [data.doj],
      department: [data.department, Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
