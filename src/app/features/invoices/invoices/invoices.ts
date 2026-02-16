import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../environment/environment';
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class InvoicesComponent {
  invoiceNumber = 10;
  today = new Date();

  invoice = {
    items: [{ description: 'Digital Marketing 1 Month Plan + Ads', cost: 0 }],
    paid: 0
  };

  bank = {
    name: 'State Bank of India',
    accountName: 'Mr. Krishna Prasad S M',
    accountNumber: '41056846725',
    ifsc: 'SBIN0070263',
    type: 'SAVINGS BANK ACCOUNT'
  };

  constructor(private http: HttpClient) {}

  get invoiceId(): string {
    return `ORQ/2026/${this.invoiceNumber.toString().padStart(3, '0')}`;
  }

  get total(): number {
    return this.invoice.items.reduce((sum, i) => sum + Number(i.cost || 0), 0);
  }

  get remaining(): number {
    return this.total - Number(this.invoice.paid || 0);
  }

  addItem() {
    this.invoice.items.push({ description: '', cost: 0 });
  }

  async generateAndDownload() {
    if (!this.invoice.items.length) {
      alert('Add at least one item');
      return;
    }

    // Mapping payload to match Backend Entity precisely
    const payload = {
      invoiceNumber: this.invoiceId,
      date: this.today.toISOString().split('T')[0], // YYYY-MM-DD format
      paid: Number(this.invoice.paid),
      total: this.total,
      remaining: this.remaining,
      items: this.invoice.items.map(item => ({
        description: item.description,
        cost: Number(item.cost)
      }))
    };

    // Sending POST to Backend
    this.http.post(`${environment.api}/api/invoices`, payload).subscribe({
      next: async (res) => {
        console.log('Successfully saved to DB:', res);
        await this.downloadPDF();
      },
      error: (err) => {
        console.error('Network Error:', err);
        alert('Backend Error: Check if endpoint /api/invoices is mapped in Spring Boot logs.');
      }
    });
  }

  async downloadPDF() {
    const element = document.getElementById('invoice');
    if (!element) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().from(element).set({
      filename: `${this.invoiceId}.pdf`,
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'pt', orientation: 'portrait' }
    }).save();
  }
}