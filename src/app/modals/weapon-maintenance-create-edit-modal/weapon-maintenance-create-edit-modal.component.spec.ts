import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponMaintenanceCreateEditModalComponent } from './weapon-maintenance-create-edit-modal.component';

describe('WeaponCreateEditModalComponent', () => {
  let component: WeaponMaintenanceCreateEditModalComponent;
  let fixture: ComponentFixture<WeaponMaintenanceCreateEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponMaintenanceCreateEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponMaintenanceCreateEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
