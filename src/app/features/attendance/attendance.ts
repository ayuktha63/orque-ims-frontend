import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AttendanceService, AttendanceRecord } from '../../core/services/attendance';
import { EmployeeService, Employee } from '../../core/services/employees';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class AttendanceComponent implements OnInit {
  currentDate = new Date();
  daysInMonth: { date: Date; isCurrentMonth: boolean; records: AttendanceRecord[] }[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  selectedDepartment = 'All';
  departments = ['All', 'Engineering', 'HR', 'Finance', 'Marketing'];
  
  selectedEmployeeId = '';
  employees: Employee[] = [];

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  allRecords: AttendanceRecord[] = [];

  constructor(
    private dialog: MatDialog, 
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.employeeService.list().subscribe(emps => {
      this.employees = emps;
      if (emps.length > 0 && !this.selectedEmployeeId) {
        this.selectedEmployeeId = emps[0].id?.toString() || '';
      }
      this.generateCalendar();
    });

    this.attendanceService.getRecords().subscribe(records => {
      this.allRecords = records;
      this.generateCalendar();
    });
    // Trigger initial fetch from API
    this.attendanceService.fetchRecords().subscribe();
  }

  get currentMonthName(): string {
    return this.monthNames[this.currentDate.getMonth()];
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  goToToday() {
    this.currentDate = new Date();
    this.generateCalendar();
  }

  generateCalendar() {
    this.daysInMonth = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get days from previous month to fill the first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      this.daysInMonth.push({
        date: d,
        isCurrentMonth: false,
        records: this.getRecordsForDate(d)
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      this.daysInMonth.push({
        date: d,
        isCurrentMonth: true,
        records: this.getRecordsForDate(d)
      });
    }
    
    // Get days from next month to complete the last week
    const lastDayOfWeek = lastDay.getDay();
    if (lastDayOfWeek < 6) {
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        const d = new Date(year, month + 1, i);
        this.daysInMonth.push({
          date: d,
          isCurrentMonth: false,
          records: this.getRecordsForDate(d)
        });
      }
    }
  }

  getRecordsForDate(date: Date): AttendanceRecord[] {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Filter records by selected employee
    const record = this.allRecords.find(r => r.date === dateStr && r.employeeId === this.selectedEmployeeId);
    
    if (record) {
      return [record];
    }
    
    // Default to 'Present' if there is no record, but only for dates up to today, and excluding future dates.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const empObj = this.employees.find(e => e.id?.toString() === this.selectedEmployeeId);
    
    if (checkDate <= today && this.selectedEmployeeId && empObj) {
      return [{
        date: dateStr,
        status: 'Present',
        employeeId: this.selectedEmployeeId,
        employeeName: empObj.name
      }];
    }
    
    return [];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  applyFilters() {
    this.generateCalendar();
  }

  openUpdateDialog(day: any) {
    if (!day.isCurrentMonth) return;
    if (!this.selectedEmployeeId) {
      alert("Please select an employee first.");
      return;
    }
    
    const empObj = this.employees.find(e => e.id?.toString() === this.selectedEmployeeId);
    if (!empObj) return;

    const dateStr = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}`;
    const record = day.records.length > 0 ? day.records[0] : null;
    
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '350px',
      data: {
        employeeName: empObj.name,
        date: dateStr,
        currentStatus: record ? record.status : null
      }
    });

    dialogRef.afterClosed().subscribe(status => {
      if (status !== undefined) {
        // If 'Present' is selected, send null to delete it explicitly from DB, or if 'Leave' then save that.
        const finalStatus = status === 'Present' ? null : status;
        this.attendanceService.setRecord(dateStr, this.selectedEmployeeId, empObj.name, finalStatus).subscribe();
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Leave': return 'status-leave';
      default: return '';
    }
  }
}
