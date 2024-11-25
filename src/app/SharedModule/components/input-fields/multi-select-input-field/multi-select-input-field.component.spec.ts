import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectInputFieldComponent } from './multi-select-input-field.component';

describe('MultiSelectInputFieldComponent', () => {
  let component: MultiSelectInputFieldComponent;
  let fixture: ComponentFixture<MultiSelectInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectInputFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiSelectInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
