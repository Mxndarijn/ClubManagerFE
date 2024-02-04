import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWeaponModalComponent } from './create-weapon-modal.component';

describe('CreateWeaponModalComponent', () => {
  let component: CreateWeaponModalComponent;
  let fixture: ComponentFixture<CreateWeaponModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWeaponModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWeaponModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
