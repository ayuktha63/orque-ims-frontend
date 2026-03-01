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

      // =============================
      // HEADER SECTION
      // =============================

      const logoWidth = 50;
      const logoHeight = 18;
      const logoX = margin;
      const logoY = 15;

      doc.addImage('assets/logos.png', 'PNG', logoX, logoY, logoWidth, logoHeight);

      const headerStartY = logoY + logoHeight + 8;

      // Company Name (Centered)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(
        'Orque Innovations LLP',
        pageWidth / 2,
        headerStartY,
        { align: 'center' }
      );

      // Address
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        'Safa Towers, TC 69/55(4), Kamaleshwaram, Manacaud,',
        pageWidth / 2,
        headerStartY + 7,
        { align: 'center' }
      );

      doc.text(
        'Thiruvananthapuram, Kerala - 695009',
        pageWidth / 2,
        headerStartY + 12,
        { align: 'center' }
      );

      // Payslip Title (Right aligned)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(
        `Payslip: ${monthName} ${year}`,
        pageWidth - margin,
        logoY + 5,
        { align: 'right' }
      );

      doc.line(margin, headerStartY + 18, pageWidth - margin, headerStartY + 18);

      // =============================
      // NET PAY HIGHLIGHT
      // =============================

      const contentStartY = headerStartY + 30;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Net Pay', margin, contentStartY);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(0, 128, 0);
      doc.text(`${currency} ${row.netPay}`, margin, contentStartY + 12);
      doc.setTextColor(0, 0, 0);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        `Gross Pay (A): ${currency} ${Number(row.basic) + Number(row.allowances)}`,
        pageWidth - margin,
        contentStartY,
        { align: 'right' }
      );

      doc.text(
        `Deductions (B): ${currency} ${row.deductions}`,
        pageWidth - margin,
        contentStartY + 7,
        { align: 'right' }
      );

      doc.line(margin, contentStartY + 20, pageWidth - margin, contentStartY + 20);

      // =============================
      // EMPLOYEE DETAILS
      // =============================

      const detailsStartY = contentStartY + 32;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Employee Details', margin, detailsStartY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Payslip No: ${row.payrollCode}`, margin, detailsStartY + 10);
      doc.text(`Employee Name: ${row.employeeName}`, margin, detailsStartY + 17);
      doc.text(`Month: ${monthName} ${year}`, margin, detailsStartY + 24);

      // =============================
      // EARNINGS TABLE
      // =============================

      autoTable(doc, {
        startY: detailsStartY + 35,
        head: [['Earnings', 'Amount']],
        body: [
          ['Basic Salary', `${currency} ${row.basic}`],
          ['Allowances', `${currency} ${row.allowances}`],
          [
            'Gross Pay (A)',
            `${currency} ${Number(row.basic) + Number(row.allowances)}`
          ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        margin: { left: margin, right: margin }
      });

      const afterGross = (doc as any).lastAutoTable.finalY + 12;

      // =============================
      // DEDUCTIONS TABLE
      // =============================

      autoTable(doc, {
        startY: afterGross,
        head: [['Deductions', 'Amount']],
        body: [
          ['Total Deductions (B)', `${currency} ${row.deductions}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [211, 84, 0] },
        margin: { left: margin, right: margin }
      });

      const afterDeduction = (doc as any).lastAutoTable.finalY + 15;

      // =============================
      // FINAL NET SUMMARY
      // =============================

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0);
      doc.text(
        `Net Salary Credited: ${currency} ${row.netPay}`,
        margin,
        afterDeduction
      );
      doc.setTextColor(0, 0, 0);

      // =============================
      // DIGITAL SIGNATURE
      // =============================

      const today = new Date().toLocaleDateString('en-GB');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      doc.text(
        'Digitally signed by',
        pageWidth - margin,
        pageHeight - 35,
        { align: 'right' }
      );

      doc.setFont('helvetica', 'bold');
      doc.text(
        'Orque Finance Team',
        pageWidth - margin,
        pageHeight - 28,
        { align: 'right' }
      );

      doc.setFont('helvetica', 'normal');
      doc.text(
        `Date: ${today}`,
        pageWidth - margin,
        pageHeight - 21,
        { align: 'right' }
      );

      doc.text(
        'Authority: Orque Innovations LLP',
        pageWidth - margin,
        pageHeight - 14,
        { align: 'right' }
      );

      // =============================
      // FOOTER
      // =============================

      doc.setFontSize(9);
      doc.text(
        'This is a computer generated payslip and does not require a signature.',
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );

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