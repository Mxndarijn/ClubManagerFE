import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderWeekEventComponent } from './calender-week-event.component';

describe('CalenderWeekEventComponentComponent', () => {
  let component: CalenderWeekEventComponent;
  let fixture: ComponentFixture<CalenderWeekEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderWeekEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderWeekEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
