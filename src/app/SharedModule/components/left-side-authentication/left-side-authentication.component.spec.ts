import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideAuthenticationComponent } from './left-side-authentication.component';

describe('LeftSideAuthenticationComponent', () => {
  let component: LeftSideAuthenticationComponent;
  let fixture: ComponentFixture<LeftSideAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSideAuthenticationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeftSideAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
