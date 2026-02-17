import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartComponent } from 'ng-apexcharts';

import { FinanceService } from '../../core/services/finance';
import { FinanceEntry } from '../../core/services/models';

import { DutyService, Duty } from '../../core/services/duty';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, ChartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  month = '2026-01';

  summary = {
    income: 0,
    expense: 0,
    profit: 0,
    count: 0
  };

  incomeExpenseChart: any;
  categoryChart: any;

  // ✅ LIVE ONGOING DUTIES
  ongoingDuties: Duty[] = [];

  constructor(
    private finance: FinanceService,
    private dutyService: DutyService,
    private auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // small delay ensures shell layout renders first
    setTimeout(() => {
      this.loadFinance();
      this.loadOngoingDuties();
    });
  }

  // =========================
  // LOAD FINANCE DATA
  // =========================
  loadFinance(): void {

    this.finance.summaryForMonth(this.month).subscribe(data => {
      this.summary = data;
      this.cd.detectChanges();
    });

    this.finance.list().subscribe((allEntries: FinanceEntry[]) => {

      const entries = allEntries.filter(e =>
        e.date.startsWith(this.month)
      );

      // ---------- Income / Expense Chart ----------
      const byDay: Record<string, { income: number; expense: number }> = {};

      for (const e of entries) {
        const day = e.date.slice(8, 10);
        byDay[day] = byDay[day] ?? { income: 0, expense: 0 };

        if (e.type === 'INCOME') {
          byDay[day].income += e.amount;
        } else {
          byDay[day].expense += e.amount;
        }
      }

      const days = Object.keys(byDay).sort();

      this.incomeExpenseChart = {
        series: [
          { name: 'Income', data: days.map(d => byDay[d].income) },
          { name: 'Expense', data: days.map(d => byDay[d].expense) }
        ],
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false }
        },
        xaxis: {
          categories: days.map(d => `${this.month}-${d}`)
        },
        colors: ['#4caf50', '#f44336']
      };

      // ---------- Category Donut ----------
      const cat: Record<string, number> = {};

      for (const e of entries.filter(x => x.type === 'EXPENSE')) {
        cat[e.category] = (cat[e.category] ?? 0) + e.amount;
      }

      this.categoryChart = {
        series: Object.values(cat),
        chart: { type: 'donut', height: 300 },
        labels: Object.keys(cat)
      };

      // ⭐ FORCE UI UPDATE AFTER CHART BUILD
      this.cd.detectChanges();
    });
  }

  // =========================
  // LOAD ONGOING DUTIES
  // =========================
  loadOngoingDuties(): void {

    const source$ = this.auth.isAdmin()
      ? this.dutyService.getAll()
      : this.dutyService.myWork(this.auth.employeeId());

    source$.subscribe(list => {
      this.ongoingDuties = (list || []).filter(
        d => d.status === 'ONGOING'
      );

      // ⭐ IMPORTANT FOR INITIAL LOAD
      this.cd.detectChanges();
    });
  }
}
