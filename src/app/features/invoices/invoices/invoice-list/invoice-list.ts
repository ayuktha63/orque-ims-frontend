import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.css']
})
export class InvoiceListComponent {

  searchText = '';

  displayedColumns: string[] = [
    'invoiceNumber',
    'date',
    'total',
    'paid',
    'remaining',
    'actions'
  ];

  // 🔁 Temporary static data (replace with API later)
  invoices = [
    {
      invoiceNumber: 'ORQ/2026/010',
      date: '12/01/2026',
      total: 15000,
      paid: 5000,
      remaining: 10000
    },
    {
      invoiceNumber: 'ORQ/2026/011',
      date: '18/01/2026',
      total: 8000,
      paid: 8000,
      remaining: 0
    },
    {
      invoiceNumber: 'ORQ/2026/012',
      date: '25/01/2026',
      total: 12000,
      paid: 4000,
      remaining: 8000
    }
  ];

  get filteredInvoices() {
    return this.invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewInvoice(invoice: any) {
    console.log('View invoice:', invoice);
    // 🔮 Next step: open invoice preview dialog or route
  }

  downloadInvoice(invoice: any) {
    console.log('Download invoice:', invoice);
    // 🔮 Next step: regenerate PDF or fetch from server
  }
}
