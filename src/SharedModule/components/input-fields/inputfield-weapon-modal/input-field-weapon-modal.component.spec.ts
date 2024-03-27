import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldWeaponModalComponent } from './input-field-weapon-modal.component';

describe('InputfieldWeaponModalComponent', () => {
  let component: InputFieldWeaponModalComponent;
  let fixture: ComponentFixture<InputFieldWeaponModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldWeaponModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFieldWeaponModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
