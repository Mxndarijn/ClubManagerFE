import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInputFieldComponent } from './update-input-field.component';

describe('UpdateInputFieldComponent', () => {
  let component: UpdateInputFieldComponent;
  let fixture: ComponentFixture<UpdateInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInputFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
