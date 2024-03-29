import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderEventComponent } from './calender-event.component';

describe('CalenderWeekEventComponentComponent', () => {
  let component: CalenderEventComponent;
  let fixture: ComponentFixture<CalenderEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
