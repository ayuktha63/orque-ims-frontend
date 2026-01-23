import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredentialUpsertDialogComponent } from './credential-upsert-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CredentialUpsertDialogComponent', () => {
  let component: CredentialUpsertDialogComponent;
  let fixture: ComponentFixture<CredentialUpsertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialUpsertDialogComponent, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { employee: {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialUpsertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});