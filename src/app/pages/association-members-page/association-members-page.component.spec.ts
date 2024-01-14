import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationMembersPageComponent } from './association-members-page.component';

describe('AssociationMembersPageComponentComponent', () => {
  let component: AssociationMembersPageComponent;
  let fixture: ComponentFixture<AssociationMembersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationMembersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationMembersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
