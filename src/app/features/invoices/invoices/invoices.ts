import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class InvoicesComponent {

  invoiceNumber = 10; // change only this number

  today = new Date();

  invoice = {
    items: [
      { description: 'Digital Marketing 1 Month Plan + Ads', cost: 0 }
    ],
    paid: 0
  };

  // 🔒 FIXED BANK DETAILS
  bank = {
    name: 'State Bank of India',
    accountName: 'Mr. Krishna Prasad S M',
    accountNumber: '41056846725',
    ifsc: 'SBIN0070263',
    type: 'SAVINGS BANK ACCOUNT'
  };

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

  async downloadPDF() {
    const el = document.getElementById('invoice');
    if (!el) return;

    const html2pdf = (await import('html2pdf.js')).default;

    html2pdf()
      .from(el)
      .set({
        filename: `${this.invoiceId}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait' }
      })
      .save();
  }
}
