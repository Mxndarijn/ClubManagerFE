import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalanderSwitchButtonComponent } from './calander-switch-button.component';

describe('CalanderSwitchButtonComponent', () => {
  let component: CalanderSwitchButtonComponent;
  let fixture: ComponentFixture<CalanderSwitchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalanderSwitchButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalanderSwitchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
