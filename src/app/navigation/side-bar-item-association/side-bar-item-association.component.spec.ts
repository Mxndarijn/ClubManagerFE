import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarItemAssociationComponent } from './side-bar-item-association.component';

describe('SideBarItemAssociationComponent', () => {
  let component: SideBarItemAssociationComponent;
  let fixture: ComponentFixture<SideBarItemAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarItemAssociationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideBarItemAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
