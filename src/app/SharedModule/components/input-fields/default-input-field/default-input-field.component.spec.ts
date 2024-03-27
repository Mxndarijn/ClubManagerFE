import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultInputFieldComponent } from './default-input-field.component';

describe('UpdateInputFieldComponent', () => {
  let component: DefaultInputFieldComponent;
  let fixture: ComponentFixture<DefaultInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultInputFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
