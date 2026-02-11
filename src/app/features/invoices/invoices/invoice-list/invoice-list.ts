import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.css']
})
export class InvoiceListComponent implements OnInit {

  searchText = '';
  invoices: any[] = [];

  displayedColumns: string[] = ['invoiceNumber', 'date', 'total', 'paid', 'remaining', 'actions'];

  private apiUrl = 'http://localhost:8080/api/invoices';

  // Fixed Bank Details to match your design
  bank = {
    name: 'State Bank of India',
    accountName: 'Mr. Krishna Prasad S M',
    accountNumber: '41056846725',
    ifsc: 'SBIN0070263',
    type: 'SAVINGS BANK ACCOUNT'
  };

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });

    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.invoices = data ?? [];
      },
      error: (err) => {
        console.error('API Error (Check JWT / Backend)', err);
      }
    });
  }

  get filteredInvoices() {
    const search = (this.searchText ?? '').toLowerCase();
    return (this.invoices ?? []).filter(inv =>
      (inv?.invoiceNumber ?? '').toString().toLowerCase().includes(search)
    );
  }

  viewInvoice(invoice: any): void {
    if (!invoice?.items?.length) {
      alert('No items found');
      return;
    }
    const details = invoice.items.map((i: any) => `${i.description}: ₹${i.cost}`).join('\n');
    alert(`Invoice: ${invoice.invoiceNumber}\n\nItems:\n${details}\n\nTotal: ₹${invoice.total}`);
  }

  async downloadInvoice(invoice: any) {
    if (!invoice) return;

    // Create a temporary container for the PDF content
    const element = document.createElement('div');
    element.innerHTML = this.generateInvoiceTemplate(invoice);
    document.body.appendChild(element);

    const html2pdf = (await import('html2pdf.js')).default;

const options = {
      margin: 0,
      filename: `${invoice.invoiceNumber}.pdf`,
      image: { 
        type: 'jpeg' as const, // Cast to 'const' to satisfy TypeScript
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true // Helps with text clarity
      },
      jsPDF: { 
        unit: 'pt' as const, 
        format: 'a4' as const, 
        orientation: 'portrait' as const // Cast to 'const'
      }
    };

    await html2pdf().from(element).set(options).save();
    document.body.removeChild(element);
  }

  private generateInvoiceTemplate(inv: any): string {
    const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${inv.invoiceNumber}`;
    
    const rows = (inv.items ?? []).map((item: any) => `
        <tr>
          <td style="padding: 10px 0; font-size: 14px; color: #333;">${item.description}</td>
          <td style="padding: 10px 0; font-size: 14px; text-align: right; font-weight: bold;">₹${item.cost}</td>
        </tr>
    `).join('');

    return `
    <div style="width: 595pt; height: 842pt; background: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; position: relative; margin: 0 auto; box-sizing: border-box;">
      
      <div style="padding: 40px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="font-size: 14px; font-weight: bold; color: #555;">${inv.invoiceNumber}</div>
        <div style="text-align: center;">
            <img src="assets/soloorque.png" style="width: 100px; display: block; margin: 0 auto 5px;">
        </div>
        <div style="font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Invoice</div>
      </div>

      <div style="padding: 0 40px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="text-align: left; font-size: 12px; color: #888; letter-spacing: 1px;">
              <th style="padding-bottom: 10px;">DESCRIPTION</th>
              <th style="padding-bottom: 10px; text-align: right;">COST</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="2"><div style="border-top: 1px dashed #ccc; margin: 5px 0;"></div></td></tr>
            ${rows}
            <tr><td colspan="2"><div style="border-top: 1px dashed #ccc; margin: 5px 0;"></div></td></tr>
            
            <tr>
              <td style="padding: 10px 0; font-size: 14px;">PAID</td>
              <td style="padding: 10px 0; font-size: 14px; text-align: right; color: #d32f2f;">-₹${inv.paid}</td>
            </tr>
            <tr><td colspan="2"><div style="border-top: 1px dashed #ccc; margin: 5px 0;"></div></td></tr>

            <tr style="font-weight: bold; font-size: 16px;">
              <td style="padding: 15px 0;">REMAINING</td>
              <td style="padding: 15px 0; text-align: right;">₹${inv.remaining}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="position: absolute; bottom: 0; width: 100%;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 588 298" preserveAspectRatio="none" style="width: 100%; height: 180px; display: block;">
          <path d="M588 298L0 298L0 21.5943L294 21.5942L441 21.5943L514.5 0L588 0L588 298Z" fill="#0A1420"/>
        </svg>

        <div style="position: absolute; bottom: 30px; width: 100%; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; color: white; font-size: 10px; box-sizing: border-box;">
          
          <div style="width: 30%; line-height: 1.5; opacity: 0.8;">
            Thank you for your partnership! Please let us know if you need anything else to process this invoice.
          </div>

          <div style="width: 40%; line-height: 1.6;">
            Bank: ${this.bank.name}<br>
            Account Name: ${this.bank.accountName}<br>
            Account Number: ${this.bank.accountNumber}<br>
            IFSC: ${this.bank.ifsc}<br>
            Account Type: ${this.bank.type}
          </div>

          <div style="text-align: right;">
            Or pay via:
            <div style="background: white; padding: 5px; border-radius: 4px; display: inline-block; margin-top: 5px;">
              <img src="${qrData}" style="width: 60px; height: 60px; display: block;">
            </div>
          </div>

          <div style="position: absolute; bottom: -15px; right: 40px; opacity: 0.6;">
            ${new Date(inv.date).toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>

    </div>
    `;
  }
}