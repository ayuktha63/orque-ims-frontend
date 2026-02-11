import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    HttpClientModule, // Required for backend communication
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
export class InvoiceListComponent implements OnInit {
  searchText: string = '';
  invoices: any[] = []; 
  displayedColumns: string[] = ['invoiceNumber', 'date', 'total', 'paid', 'remaining', 'actions'];

  // Base API URL - ensure this matches your server.servlet.context-path if defined
  private apiUrl = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  /**
   * Fetches the list of invoices from the Spring Boot API.
   */
  loadInvoices(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.invoices = data;
        console.log('Invoices loaded:', this.invoices);
      },
      error: (err) => {
        console.error('Failed to load invoices. Check if Backend is running on 8080.', err);
      }
    });
  }

  /**
   * Filters the table data based on the invoice number search input.
   */
  get filteredInvoices() {
    return this.invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewInvoice(invoice: any): void {
    alert(`Viewing Details for: ${invoice.invoiceNumber}\nTotal: ₹${invoice.total}`);
  }

  /**
   * Triggers a PDF download using the saved invoice data.
   */
  async downloadInvoice(invoice: any) {
    console.log('Generating PDF for:', invoice.invoiceNumber);
    // Note: To use html2pdf here, you'd need the same logic used in your creation component
  }
}