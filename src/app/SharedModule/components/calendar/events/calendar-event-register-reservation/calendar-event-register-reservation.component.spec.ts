import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventRegisterReservationComponent } from './calendar-event-register-reservation.component';

describe('CalendarEventRegisterReservationComponent', () => {
  let component: CalendarEventRegisterReservationComponent;
  let fixture: ComponentFixture<CalendarEventRegisterReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEventRegisterReservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarEventRegisterReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
