import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceUpsertDialog } from './finance-upsert-dialog';

describe('FinanceUpsertDialog', () => {
  let component: FinanceUpsertDialog;
  let fixture: ComponentFixture<FinanceUpsertDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceUpsertDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceUpsertDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
