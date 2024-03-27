import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationNameComponent } from './association-name.component';

describe('AssociationNameComponent', () => {
  let component: AssociationNameComponent;
  let fixture: ComponentFixture<AssociationNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociationNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
