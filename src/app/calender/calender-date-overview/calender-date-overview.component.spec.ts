import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderDateOverviewComponent } from './calender-date-overview.component';

describe('CalenderOverviewComponent', () => {
  let component: CalenderDateOverviewComponent;
  let fixture: ComponentFixture<CalenderDateOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderDateOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderDateOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
