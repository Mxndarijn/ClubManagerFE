import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderUpcomingEventComponent } from './calender-upcoming-event.component';

describe('CalenderUpcomingEventComponent', () => {
  let component: CalenderUpcomingEventComponent;
  let fixture: ComponentFixture<CalenderUpcomingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderUpcomingEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalenderUpcomingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
