import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCheckboxInputFieldComponent } from './default-checkbox-input-field.component';

describe('DefaultCheckboxInputFieldComponent', () => {
  let component: DefaultCheckboxInputFieldComponent;
  let fixture: ComponentFixture<DefaultCheckboxInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultCheckboxInputFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultCheckboxInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
