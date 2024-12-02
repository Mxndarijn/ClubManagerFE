import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationsPageComponent } from './my-reservations-page.component';

describe('MyReservationsPageComponent', () => {
  let component: MyReservationsPageComponent;
  let fixture: ComponentFixture<MyReservationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyReservationsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyReservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
