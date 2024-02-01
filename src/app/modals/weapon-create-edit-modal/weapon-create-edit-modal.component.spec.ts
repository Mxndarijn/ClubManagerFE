import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponCreateEditModalComponent } from './weapon-create-edit-modal.component';

describe('WeaponCreateEditModalComponent', () => {
  let component: WeaponCreateEditModalComponent;
  let fixture: ComponentFixture<WeaponCreateEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponCreateEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaponCreateEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
