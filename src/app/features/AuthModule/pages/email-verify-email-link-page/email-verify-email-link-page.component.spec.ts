import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifyEmailLinkPageComponent } from './email-verify-email-link-page.component';

describe('EmailVerifyEmailLinkPageComponent', () => {
  let component: EmailVerifyEmailLinkPageComponent;
  let fixture: ComponentFixture<EmailVerifyEmailLinkPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerifyEmailLinkPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailVerifyEmailLinkPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
