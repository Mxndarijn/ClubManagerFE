import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationPresenceCreateComponent } from './association-presence-create.component';

describe('AssociationPresenceCreateComponent', () => {
  let component: AssociationPresenceCreateComponent;
  let fixture: ComponentFixture<AssociationPresenceCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationPresenceCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociationPresenceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
