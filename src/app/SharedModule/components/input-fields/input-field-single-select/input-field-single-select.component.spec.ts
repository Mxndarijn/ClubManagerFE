import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldSingleSelectComponent } from './input-field-single-select.component';

describe('InputFieldSingleSelectComponent', () => {
  let component: InputFieldSingleSelectComponent;
  let fixture: ComponentFixture<InputFieldSingleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldSingleSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputFieldSingleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
