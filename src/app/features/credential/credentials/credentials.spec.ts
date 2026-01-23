import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredentialsComponent } from './credentials';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('CredentialsComponent', () => {
  let component: CredentialsComponent;
  let fixture: ComponentFixture<CredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialsComponent, HttpClientTestingModule, MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});