import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundedSocialBoxComponent } from './rounded-social-box.component';

describe('RoundedSocialBoxComponent', () => {
  let component: RoundedSocialBoxComponent;
  let fixture: ComponentFixture<RoundedSocialBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundedSocialBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoundedSocialBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
