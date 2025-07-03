import { Component, OnInit, Inject } from '@angular/core';
import { EmployeesService } from '../services/employees.service';
import { Employee } from '../models/employee';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  displayedColumns = ['name', 'email', 'phone', 'actions'];

  constructor(private service: EmployeesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe({
      next: data => (this.employees = data),
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
        this.service.update(emp.id!, result).subscribe(() => this.load());
      }
    });
  }

  delete(emp: Employee): void {
    if (confirm('Delete employee?')) {
      this.service.delete(emp.id!).subscribe(() => this.load());
    }
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
    const worksheet = XLSX.utils.json_to_sheet(this.employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    XLSX.writeFile(workbook, 'employees.xlsx');
  }
}

@Component({
  selector: 'employee-dialog',
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
      email: [data.email, [Validators.required, Validators.email]],
      phone: [data.phone, Validators.required]
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
