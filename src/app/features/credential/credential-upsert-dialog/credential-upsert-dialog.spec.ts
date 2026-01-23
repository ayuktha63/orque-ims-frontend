import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialUpsertDialog } from './credential-upsert-dialog';

describe('CredentialUpsertDialog', () => {
  let component: CredentialUpsertDialog;
  let fixture: ComponentFixture<CredentialUpsertDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialUpsertDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialUpsertDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
