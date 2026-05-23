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

    const logo = new Image();
    logo.src = 'assets/logos.png';

    logo.onload = () => {

      const logoWidth = 45;
      const logoHeight = (logo.height * logoWidth) / logo.width;

      doc.addImage(logo, 'PNG', 14, 12, logoWidth, logoHeight);

      // =============================
      // FORMAT MONTH
      // =============================

      const [year, month] = row.month.split('-');
      const monthName = new Date(Number(year), Number(month) - 1)
        .toLocaleString('default', { month: 'long' });

      const currency = 'Rs';

      // HEADER
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Orque Innovations LLP', 65, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        'Safa Towers, TC 69/55(4), Kamaleshwaram, Manacaud,',
        65,
        27
      );
      doc.text(
        'Thiruvananthapuram, Kerala - 695009',
        65,
        32
      );
      doc.text('Finance Team', 65, 37);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Payslip: ${monthName} ${year}`, 150, 20);

      doc.line(14, 45, 196, 45);

      // NET PAY
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Net Pay', 14, 60);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(`${currency} ${row.netPay}`, 14, 72);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Gross Pay (A): ${currency} ${Number(row.basic) + Number(row.allowances)}`,
        110,
        62
      );
      doc.text(
        `Deductions (B): ${currency} ${row.deductions}`,
        110,
        69
      );

      doc.line(14, 85, 196, 85);

      // EMPLOYEE DETAILS
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Employee Details', 14, 100);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Payslip No: ${row.payrollCode}`, 14, 110);
      doc.text(`Employee Name: ${row.employeeName}`, 14, 117);
      doc.text(`Month: ${monthName} ${year}`, 14, 124);

      // EARNINGS TABLE
      autoTable(doc, {
        startY: 135,
        head: [['Earnings', 'Amount']],
        body: [
          ['Basic Salary', `${currency} ${row.basic}`],
          ['Allowances', `${currency} ${row.allowances}`],
          [
            'Gross Pay (A)',
            `${currency} ${Number(row.basic) + Number(row.allowances)}`
          ]
        ],
        theme: 'grid'
      });

      const afterGross = (doc as any).lastAutoTable.finalY + 10;

      autoTable(doc, {
        startY: afterGross,
        head: [['Deductions', 'Amount']],
        body: [
          ['Total Deductions (B)', `${currency} ${row.deductions}`]
        ],
        theme: 'grid'
      });

      const afterDeduction = (doc as any).lastAutoTable.finalY + 15;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0);
      doc.text(
        `Net Salary Credited: ${currency} ${row.netPay}`,
        14,
        afterDeduction
      );

      doc.setTextColor(0, 0, 0);

      const today = new Date().toLocaleDateString('en-GB');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      doc.text('Digitally signed by', 140, 260);
      doc.setFont('helvetica', 'bold');
      doc.text('Orque Finance Team', 140, 267);

      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${today}`, 140, 274);

      doc.setFontSize(9);
      doc.text(
        'This is a computer generated payslip and does not require a signature.',
        14,
        292
      );

      doc.save(`Payslip-${row.employeeName}-${monthName}-${year}.pdf`);
    };

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