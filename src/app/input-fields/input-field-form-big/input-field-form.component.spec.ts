import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldFormComponent } from './input-field-form.component';

describe('InputFieldFormComponent', () => {
  let component: InputFieldFormComponent;
  let fixture: ComponentFixture<InputFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
