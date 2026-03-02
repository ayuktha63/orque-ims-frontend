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
    duties: true
  };

  constructor(
    private finance: FinanceService,
    private dutyService: DutyService,
    private auth: AuthService,
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
  private storageKey(): string {
    return `dashboard-config-${this.auth.employeeId()}`;
  }

  loadConfig(): void {
    const saved = localStorage.getItem(this.storageKey());
    if (saved) {
      this.dashboardConfig = JSON.parse(saved);
    }
  }

  onConfigChange(): void {
    localStorage.setItem(
      this.storageKey(),
      JSON.stringify(this.dashboardConfig)
    );
    this.refreshDashboard();
  }

  // =========================
  // REFRESH
  // =========================
  refreshDashboard(): void {

    if (this.canViewFinanceDashboard) {
      this.loadFinance();
    }

    this.loadOngoingDuties();
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
}