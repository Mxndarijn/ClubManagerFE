import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationGuestsPageComponent } from './association-guests-page.component';

describe('AssociationGuestsPageComponent', () => {
  let component: AssociationGuestsPageComponent;
  let fixture: ComponentFixture<AssociationGuestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationGuestsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociationGuestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
