import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityCodeModalComponent } from './security-code-modal.component';

describe('SecurityCodeModalComponent', () => {
  let component: SecurityCodeModalComponent;
  let fixture: ComponentFixture<SecurityCodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityCodeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
