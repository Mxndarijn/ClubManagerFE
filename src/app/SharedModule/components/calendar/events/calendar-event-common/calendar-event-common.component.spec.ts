import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventCommonComponent } from './calendar-event-common.component';

describe('CalendarEventCommonComponent', () => {
  let component: CalendarEventCommonComponent;
  let fixture: ComponentFixture<CalendarEventCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEventCommonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarEventCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
