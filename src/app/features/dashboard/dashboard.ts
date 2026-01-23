import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartComponent } from 'ng-apexcharts';

import { FinanceService } from '../../core/services/finance';
import { FinanceEntry } from '../../core/services/models'; // Ensure this exists

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
  summary = { income: 0, expense: 0, profit: 0, count: 0 };

  incomeExpenseChart: any;
  categoryChart: any;

  constructor(private finance: FinanceService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    // 1. Get the summary using the Observable method we added to the service
    this.finance.summaryForMonth(this.month).subscribe(data => {
      this.summary = data;
    });

    // 2. Fetch the full list to generate the charts
    this.finance.list().subscribe((allEntries: FinanceEntry[]) => {
      // Filter entries locally for the selected month
      const entries = allEntries.filter(e => e.date.startsWith(this.month));

      // --- Line/Bar Chart Logic ---
      const byDay: Record<string, { income: number; expense: number }> = {};
      for (const e of entries) {
        const day = e.date.slice(8, 10);
        byDay[day] = byDay[day] ?? { income: 0, expense: 0 };
        if (e.type === 'INCOME') byDay[day].income += e.amount;
        else byDay[day].expense += e.amount;
      }

      const days = Object.keys(byDay).sort();
      const incomeSeries = days.map(d => byDay[d].income);
      const expenseSeries = days.map(d => byDay[d].expense);

      this.incomeExpenseChart = {
        series: [
          { name: 'Income', data: incomeSeries },
          { name: 'Expense', data: expenseSeries }
        ],
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        xaxis: { categories: days.map(d => `${this.month}-${d}`) },
        colors: ['#4caf50', '#f44336'] // Green for Income, Red for Expense
      };

      // --- Category Donut Chart Logic ---
      const cat: Record<string, number> = {};
      // Explicitly type 'x' to avoid the "implicit any" error
      for (const e of entries.filter((x: FinanceEntry) => x.type === 'EXPENSE')) {
        cat[e.category] = (cat[e.category] ?? 0) + e.amount;
      }

      this.categoryChart = {
        series: Object.values(cat),
        chart: { type: 'donut', height: 300 },
        labels: Object.keys(cat)
      };
    });
  }
}