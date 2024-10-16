import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTrackReservationModalComponent} from './create-track-reservation-modal.component';

describe('CreateTrackReservationModalComponent', () => {
  let component: CreateTrackReservationModalComponent;
  let fixture: ComponentFixture<CreateTrackReservationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrackReservationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTrackReservationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
