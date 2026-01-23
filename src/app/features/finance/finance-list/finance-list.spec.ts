import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceList } from './finance-list';

describe('FinanceList', () => {
  let component: FinanceList;
  let fixture: ComponentFixture<FinanceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
