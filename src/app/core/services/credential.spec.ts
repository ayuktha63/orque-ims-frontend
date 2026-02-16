import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CredentialService, Credential } from './credential';
import { environment } from '../../../environment/environment';
describe('CredentialService', () => {
  let service: CredentialService;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.api}/api/credentials`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CredentialService]
    });
    service = TestBed.inject(CredentialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifies that no requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all credentials (list)', () => {
    const dummyCredentials: Credential[] = [
      { id: 1, employeeId: 101, username: 'admin.test', role: 'ADMIN' },
      { id: 2, employeeId: 102, username: 'user.test', role: 'USER' }
    ];

    service.list().subscribe(credentials => {
      expect(credentials.length).toBe(2);
      expect(credentials).toEqual(dummyCredentials);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCredentials);
  });

  it('should upsert credentials via POST', () => {
    const newCredential: Credential = {
      employeeId: 105,
      username: 'new.user',
      password: 'password123',
      role: 'USER'
    };

    service.upsert(newCredential).subscribe(response => {
      expect(response).toEqual(newCredential);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCredential);
    req.flush(newCredential);
  });

  it('should delete credentials by ID', () => {
    const targetId = 99;

    service.delete(targetId).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${API_URL}/${targetId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});