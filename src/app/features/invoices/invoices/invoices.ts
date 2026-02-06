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

  showPreview = false;

  invoice = {
    invoiceId: '',
    date: '',
    items: [
      { description: '', cost: 0 }
    ],
    paid: 0,
    bank: {
      name: '',
      accountName: '',
      accountNumber: '',
      ifsc: '',
      type: ''
    }
  };

  get total(): number {
    return this.invoice.items.reduce((s, i) => s + Number(i.cost || 0), 0);
  }

  get remaining(): number {
    return this.total - Number(this.invoice.paid || 0);
  }

  addItem() {
    this.invoice.items.push({ description: '', cost: 0 });
  }

  generateInvoice() {
    this.showPreview = true;
  }

  async downloadPDF() {
    if (typeof window === 'undefined') return;

    const el = document.getElementById('invoice');
    if (!el) return;

    const fileName = prompt('Enter PDF file name') || 'invoice';

    const html2pdf = (await import('html2pdf.js')).default;

    html2pdf()
      .from(el)
      .set({
        filename: `${fileName}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait' }
      })
      .save();
  }
}
