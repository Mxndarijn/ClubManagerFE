import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollAtReservationModalComponent } from './enroll-at-reservation-modal.component';

describe('EnrollAtReservationModalComponent', () => {
  let component: EnrollAtReservationModalComponent;
  let fixture: ComponentFixture<EnrollAtReservationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollAtReservationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnrollAtReservationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
