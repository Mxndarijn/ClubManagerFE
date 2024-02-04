import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeControllerComponent } from './theme-controller.component';

describe('ThemeControllerComponent', () => {
  let component: ThemeControllerComponent;
  let fixture: ComponentFixture<ThemeControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeControllerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemeControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
