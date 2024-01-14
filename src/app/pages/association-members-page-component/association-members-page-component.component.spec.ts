import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationMembersPageComponentComponent } from './association-members-page-component.component';

describe('AssociationMembersPageComponentComponent', () => {
  let component: AssociationMembersPageComponentComponent;
  let fixture: ComponentFixture<AssociationMembersPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationMembersPageComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociationMembersPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
