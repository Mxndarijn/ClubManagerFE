import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewTrackReservationModalComponent} from './view-track-reservation-modal.component';

describe('ViewTrackReservationModalComponent', () => {
  let component: ViewTrackReservationModalComponent;
  let fixture: ComponentFixture<ViewTrackReservationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTrackReservationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTrackReservationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
