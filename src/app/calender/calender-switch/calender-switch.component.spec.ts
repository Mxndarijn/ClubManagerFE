import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderSwitchComponent } from './calender-switch.component';

describe('CalenderSwitchButtonComponent', () => {
  let component: CalenderSwitchComponent;
  let fixture: ComponentFixture<CalenderSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderSwitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalenderSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
