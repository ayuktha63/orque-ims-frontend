import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollRunDialog } from './payroll-run-dialog';

describe('PayrollRunDialog', () => {
  let component: PayrollRunDialog;
  let fixture: ComponentFixture<PayrollRunDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollRunDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollRunDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
