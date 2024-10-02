import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeSelectInputFieldComponent } from './type-select-input-field.component';

describe('TypeSelectInputFieldComponent', () => {
  let component: TypeSelectInputFieldComponent;
  let fixture: ComponentFixture<TypeSelectInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeSelectInputFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeSelectInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
