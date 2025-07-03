import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsService } from '../services/departments.service';
import { Department } from '../models/department';
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
  selector: 'app-departments',
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
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['department', 'actions'];
  dataSource = new MatTableDataSource<Department>([]);
  search = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: DepartmentsService, private dialog: MatDialog) {}

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
    const dialogRef = this.dialog.open(DepartmentDialog, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.add(result).subscribe(() => this.load());
      }
    });
  }

  openEdit(dep: Department): void {
    const dialogRef = this.dialog.open(DepartmentDialog, {
      width: '300px',
      data: { ...dep }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.update(dep.id!, result).subscribe(() => this.load());
      }
    });
  }

  delete(dep: Department): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Delete department?'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.service.delete(dep.id!).subscribe(() => this.load());
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
      const rows: Department[] = XLSX.utils.sheet_to_json(sheet);
      rows.forEach(row => {
        this.service.add(row).subscribe(() => this.load());
      });
    };
    reader.readAsArrayBuffer(file);
  }

  exportExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Departments');
    XLSX.writeFile(workbook, 'departments.xlsx');
  }
}

@Component({
  selector: 'department-dialog',
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
  templateUrl: './department-dialog.html'
})
export class DepartmentDialog {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DepartmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Department,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      department: [data.department, Validators.required],
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
