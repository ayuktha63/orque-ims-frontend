import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollUpsertDialog } from './payroll-upsert-dialog';

describe('PayrollUpsertDialog', () => {
  let component: PayrollUpsertDialog;
  let fixture: ComponentFixture<PayrollUpsertDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollUpsertDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollUpsertDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
