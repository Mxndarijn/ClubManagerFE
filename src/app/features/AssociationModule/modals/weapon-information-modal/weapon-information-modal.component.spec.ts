import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WeaponInformationModalComponent} from './weapon-information-modal.component';

describe('WeaponInformationModalComponent', () => {
  let component: WeaponInformationModalComponent;
  let fixture: ComponentFixture<WeaponInformationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponInformationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponInformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
