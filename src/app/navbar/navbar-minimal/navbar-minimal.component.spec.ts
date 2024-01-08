import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarMinimalComponent } from './navbar-minimal.component';

describe('NavbarMinimalComponent', () => {
  let component: NavbarMinimalComponent;
  let fixture: ComponentFixture<NavbarMinimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarMinimalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarMinimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
