import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationDetailModalComponent } from './my-reservation-detail-modal.component';

describe('MyReservationDetailModalComponent', () => {
  let component: MyReservationDetailModalComponent;
  let fixture: ComponentFixture<MyReservationDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReservationDetailModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyReservationDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
