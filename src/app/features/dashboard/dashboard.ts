import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChartComponent } from 'ng-apexcharts';

import { FinanceService } from '../../core/services/finance';
import { FinanceEntry } from '../../core/services/models';
import { DutyService, Duty } from '../../core/services/duty';
import { AuthService } from '../../core/services/auth';
import { AttendanceService, AttendanceRecord } from '../../core/services/attendance';
import { SettingsService } from '../../core/services/settings';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ChartComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  month = new Date().toISOString().slice(0, 7);

  // ✅ ROLE FLAGS (Aligned with Backend)
  isSystemAdmin = false;
  isFinance = false;
  canViewFinanceDashboard = false;

  summary = {
    income: 0,
    expense: 0,
    profit: 0,
    count: 0
  };

  incomeExpenseChart: any;
  categoryChart: any;
  ongoingDuties: Duty[] = [];

  dashboardConfig = {
    profit: true,
    incomeChart: true,
    categoryChart: true,
    duties: true,
    upcomingLeaves: true
  };

  constructor(
    private finance: FinanceService,
    private dutyService: DutyService,
    private auth: AuthService,
    private attendanceService: AttendanceService,
    private settingsService: SettingsService,
    private cd: ChangeDetectorRef
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    const role = this.auth.getRole();

    this.isSystemAdmin = role === 'SYSTEM_ADMIN';
    this.isFinance = role === 'FINANCE';
    this.canViewFinanceDashboard = this.isSystemAdmin || this.isFinance;

    this.loadConfig();
    this.refreshDashboard();
  }

  // =========================
  // CONFIG STORAGE
  // =========================

  loadConfig(): void {
    const employeeId = this.auth.employeeId();
    if (!employeeId) return;
    const empIdStr = String(employeeId);

    this.settingsService.getSettings(empIdStr).subscribe({
      next: (settings) => {
        if (settings && settings.configJson) {
          try {
            this.dashboardConfig = JSON.parse(settings.configJson);
            this.refreshDashboard(); // Refresh after loading async config
          } catch (e) {
            console.error('Failed to parse settings JSON', e);
          }
        }
      },
      error: (err) => {
        console.warn('Could not load settings from backend, using defaults', err);
      }
    });
  }

  onConfigChange(): void {
    const employeeId = this.auth.employeeId();
    if (!employeeId) return;
    const empIdStr = String(employeeId);

    this.settingsService.saveSettings(empIdStr, JSON.stringify(this.dashboardConfig)).subscribe({
      next: () => {
        this.refreshDashboard();
      },
      error: (err) => {
        console.error('Failed to save settings to backend', err);
      }
    });
  }

  // =========================
  // REFRESH
  // =========================
  refreshDashboard(): void {

    if (this.canViewFinanceDashboard) {
      this.loadFinance();
    }

    this.loadOngoingDuties();
    this.loadUpcomingLeaves();
  }

  // =========================
  // FINANCE (Only for FINANCE + SYSTEM_ADMIN)
  // =========================
  loadFinance(): void {

    this.incomeExpenseChart = undefined;
    this.categoryChart = undefined;

    this.finance.list().subscribe((allEntries: FinanceEntry[]) => {

      let income = 0;
      let expense = 0;

      for (const e of allEntries) {
        const amount = Number(e.amount) || 0;

        if (e.type === 'INCOME') income += amount;
        else expense += amount;
      }

      const profit = income - expense;

      this.summary = {
        income: +income.toFixed(2),
        expense: +expense.toFixed(2),
        profit: +profit.toFixed(2),
        count: allEntries.length
      };

      // Monthly Chart
      const entries = allEntries.filter(e =>
        e.date?.startsWith(this.month)
      );

      const byDay: Record<string, { income: number; expense: number }> = {};

      for (const e of entries) {

        const amount = Number(e.amount) || 0;
        const day = e.date.slice(8, 10);

        byDay[day] = byDay[day] ?? { income: 0, expense: 0 };

        if (e.type === 'INCOME') {
          byDay[day].income += amount;
        } else {
          byDay[day].expense += amount;
        }
      }

      const days = Object.keys(byDay).sort();

      this.incomeExpenseChart = {
        series: [
          { name: 'Income', data: days.map(d => byDay[d].income) },
          { name: 'Expense', data: days.map(d => byDay[d].expense) }
        ],
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        xaxis: { categories: days.map(d => `${this.month}-${d}`) },
        colors: ['#4caf50', '#f44336']
      };

      const cat: Record<string, number> = {};

      for (const e of entries.filter(x => x.type === 'EXPENSE')) {
        const amount = Number(e.amount) || 0;
        cat[e.category] = (cat[e.category] ?? 0) + amount;
      }

      this.categoryChart = {
        series: Object.values(cat),
        chart: { type: 'donut', height: 300 },
        labels: Object.keys(cat)
      };

      this.cd.detectChanges();
    });
  }

  // =========================
  // DUTIES (ALL USERS)
  // =========================
  loadOngoingDuties(): void {

    const role = this.auth.getRole();

    const source$ =
      role === 'SYSTEM_ADMIN' || role === 'MANAGER' || role === 'HR'
        ? this.dutyService.getAll()
        : this.dutyService.myWork(this.auth.employeeId());

    source$.subscribe(list => {
      this.ongoingDuties = (list || []).filter(
        d => d.status === 'ONGOING'
      );

      this.cd.detectChanges();
    });
  }

  // =========================
  // ATTENDANCE (Upcoming leaves for next 4 days)
  // =========================
  upcomingLeaves: AttendanceRecord[] = [];

  loadUpcomingLeaves(): void {
    // Force a fresh fetch from the server
    this.attendanceService.fetchRecords().subscribe();

    this.attendanceService.getRecords().subscribe(records => {
      // Find leaves in the next 4 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const next4Days = new Date(today);
      next4Days.setDate(today.getDate() + 4);

      this.upcomingLeaves = records.filter(r => {
        if (r.status !== 'Leave') return false;
        
        const recordDate = new Date(r.date);
        recordDate.setHours(0, 0, 0, 0);
        
        return recordDate >= today && recordDate <= next4Days;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.cd.detectChanges();
    });
  }
}