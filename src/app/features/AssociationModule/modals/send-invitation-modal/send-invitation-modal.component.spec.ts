import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SendInvitationModalComponent} from './send-invitation-modal.component';

describe('SendInvitationModalComponent', () => {
  let component: SendInvitationModalComponent;
  let fixture: ComponentFixture<SendInvitationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendInvitationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendInvitationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
