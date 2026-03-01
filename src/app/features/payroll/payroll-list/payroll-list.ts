import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BehaviorSubject, switchMap } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import emailjs from '@emailjs/browser';

import { PayrollService } from '../../../core/services/payroll';
import { PayrollEntry } from '../../../core/models/payroll.model';
import { PayrollUpsertDialogComponent } from '../payroll-upsert-dialog/payroll-upsert-dialog';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  templateUrl: './payroll-list.html',
  styleUrls: ['./payroll-list.css']
})
export class PayrollListComponent implements OnInit {

  // =============================
  // EMAILJS CONFIG (HARDCODED)
  // =============================
  private readonly SERVICE_ID = 'service_sbiip37';
  private readonly TEMPLATE_ID = 'template_bvdc70s';
  private readonly PUBLIC_KEY = 'iPvr2QDaUlGlI1t1C';
  private readonly PORTAL_URL = 'https://app.orque-ims.xyz';

  displayedColumns = [
    'select',
    'payrollCode',
    'month',
    'employeeName',
    'basic',
    'allowances',
    'deductions',
    'netPay',
    'actions'
  ];

  selectedRows: PayrollEntry[] = [];
  sendingEmailId: number | null = null;

  private refresh$ = new BehaviorSubject<void>(undefined);
  rows$ = this.refresh$.pipe(switchMap(() => this.payrollService.list()));

  constructor(
    private payrollService: PayrollService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  fetchData(): void {
    this.refresh$.next();
  }

  toggleRow(row: PayrollEntry, checked: boolean) {
    if (checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(r => r.id !== row.id);
    }
  }

  clearSelection() {
    this.selectedRows = [];
  }

  // =====================================================
  // EMAIL SEND METHOD
  // =====================================================

  async sendPayslipEmail(row: PayrollEntry) {

    if (!row.employeeEmail) {
      alert('Employee email not available.');
      return;
    }

    this.sendingEmailId = row.id!;

    const [year, month] = row.month.split('-');
    const monthName = new Date(Number(year), Number(month) - 1)
      .toLocaleString('default', { month: 'long' });

    const formattedMonth = `${monthName} ${year}`;

    const downloadLink =
      `${this.PORTAL_URL}/api/payroll/download/${row.id}`;

    try {

      await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        {
          email: row.employeeEmail,
          to_name: row.employeeName,
          month: formattedMonth,
          net_pay: row.netPay,
          download_link: downloadLink,
          portal_link: this.PORTAL_URL
        },
        this.PUBLIC_KEY
      );

      alert('Payslip email sent successfully.');

    } catch (error) {
      console.error(error);
      alert('Failed to send email.');
    }

    this.sendingEmailId = null;
  }

  // =====================================================
  // YOUR ORIGINAL PDF GENERATION CODE (UNCHANGED)
  // =====================================================

  generatePdf() {

    if (this.selectedRows.length === 0) return;

    this.selectedRows.forEach((row) => {

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;

      const currency = 'Rs';

      const [year, month] = row.month.split('-');
      const monthName = new Date(Number(year), Number(month) - 1)
        .toLocaleString('default', { month: 'long' });

      const logoWidth = 50;
      const logoHeight = 18;
      const logoX = margin;
      const logoY = 15;

      doc.addImage('assets/logos.png', 'PNG', logoX, logoY, logoWidth, logoHeight);

      const headerStartY = logoY + logoHeight + 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Orque Innovations LLP', pageWidth / 2, headerStartY, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Safa Towers, Kamaleshwaram, Manacaud,',
        pageWidth / 2, headerStartY + 7, { align: 'center' });

      doc.text('Thiruvananthapuram, Kerala - 695009',
        pageWidth / 2, headerStartY + 12, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Payslip: ${monthName} ${year}`,
        pageWidth - margin, logoY + 5, { align: 'right' });

      doc.line(margin, headerStartY + 18, pageWidth - margin, headerStartY + 18);

      const contentStartY = headerStartY + 30;

      doc.setFontSize(22);
      doc.setTextColor(0, 128, 0);
      doc.text(`${currency} ${row.netPay}`, margin, contentStartY + 12);
      doc.setTextColor(0, 0, 0);

      autoTable(doc, {
        startY: contentStartY + 35,
        head: [['Description', 'Amount']],
        body: [
          ['Basic Salary', `${currency} ${row.basic}`],
          ['Allowances', `${currency} ${row.allowances}`],
          ['Deductions', `${currency} ${row.deductions}`],
          ['Net Pay', `${currency} ${row.netPay}`]
        ],
        theme: 'grid',
        margin: { left: margin, right: margin }
      });

      doc.save(`Payslip-${row.employeeName}-${monthName}-${year}.pdf`);
    });

    this.clearSelection();
  }

  private openDrawer(data: PayrollEntry | null): void {
    const ref = this.dialog.open(PayrollUpsertDialogComponent, {
      data,
      panelClass: 'right-drawer-dialog',
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '50vw',
      autoFocus: false
    });

    ref.afterClosed().subscribe(didSave => {
      if (didSave) this.fetchData();
    });
  }

  add(): void { this.openDrawer(null); }
  edit(row: PayrollEntry): void { this.openDrawer(row); }

  remove(row: PayrollEntry): void {
    if (confirm(`Delete payroll ${row.payrollCode}?`) && row.id) {
      this.payrollService.remove(Number(row.id))
        .subscribe(() => this.fetchData());
    }
  }
}