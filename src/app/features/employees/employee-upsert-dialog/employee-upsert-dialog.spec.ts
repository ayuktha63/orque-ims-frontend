import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpsertDialog } from './employee-upsert-dialog';

describe('EmployeeUpsertDialog', () => {
  let component: EmployeeUpsertDialog;
  let fixture: ComponentFixture<EmployeeUpsertDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeUpsertDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpsertDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
