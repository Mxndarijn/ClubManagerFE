import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldDurationComponent } from './input-field-duration.component';

describe('InputFieldDurationComponent', () => {
  let component: InputFieldDurationComponent;
  let fixture: ComponentFixture<InputFieldDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldDurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputFieldDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
