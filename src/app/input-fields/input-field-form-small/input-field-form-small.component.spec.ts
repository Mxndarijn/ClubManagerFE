import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldFormSmallComponent } from './input-field-form-small.component';

describe('InputFieldFormSmallComponent', () => {
  let component: InputFieldFormSmallComponent;
  let fixture: ComponentFixture<InputFieldFormSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldFormSmallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputFieldFormSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
