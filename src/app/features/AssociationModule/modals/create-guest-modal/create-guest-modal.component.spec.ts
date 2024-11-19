import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGuestModalComponent } from './create-guest-modal.component';

describe('CreateGuestModalComponent', () => {
  let component: CreateGuestModalComponent;
  let fixture: ComponentFixture<CreateGuestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGuestModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateGuestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
