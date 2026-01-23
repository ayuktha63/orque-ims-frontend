import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PayrollService } from './payroll';

describe('PayrollService', () => {
  let service: PayrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PayrollService]
    });
    service = TestBed.inject(PayrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});