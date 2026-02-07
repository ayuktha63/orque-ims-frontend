import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartComponent } from 'ng-apexcharts';

import { FinanceService } from '../../core/services/finance';
import { FinanceEntry } from '../../core/services/models';

interface Task {
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

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

  // ✅ FRONTEND-ONLY TASK DATA
  tasks: Task[] = [
    {
      title: 'Prepare Invoice UI',
      assignedTo: 'Ashish',
      dueDate: '2026-01-12',
      status: 'IN_PROGRESS'
    },
    {
      title: 'Dashboard Chart Fix',
      assignedTo: 'Krishna',
      dueDate: '2026-01-15',
      status: 'TODO'
    },
    {
      title: 'Client Follow-up',
      assignedTo: 'Anas',
      dueDate: '2026-01-10',
      status: 'DONE'
    }
  ];

  constructor(private finance: FinanceService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {

    this.finance.summaryForMonth(this.month).subscribe(data => {
      this.summary = data;
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

      // ---------- Category Donut Chart ----------
      const cat: Record<string, number> = {};

      for (const e of entries.filter(x => x.type === 'EXPENSE')) {
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
