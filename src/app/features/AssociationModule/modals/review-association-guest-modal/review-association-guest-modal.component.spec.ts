import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAssociationGuestModalComponent } from './review-association-guest-modal.component';

describe('ReviewAssociationGuestModalComponent', () => {
  let component: ReviewAssociationGuestModalComponent;
  let fixture: ComponentFixture<ReviewAssociationGuestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewAssociationGuestModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewAssociationGuestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
