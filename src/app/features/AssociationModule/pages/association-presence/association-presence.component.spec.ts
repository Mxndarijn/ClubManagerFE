import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationPresenceComponent } from './association-presence.component';

describe('AssociationPresenceComponent', () => {
  let component: AssociationPresenceComponent;
  let fixture: ComponentFixture<AssociationPresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationPresenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociationPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
