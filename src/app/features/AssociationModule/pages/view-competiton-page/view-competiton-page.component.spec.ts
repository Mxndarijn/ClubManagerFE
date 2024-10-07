import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompetitonPageComponent } from './view-competiton-page.component';

describe('ViewCompetitonPageComponent', () => {
  let component: ViewCompetitonPageComponent;
  let fixture: ComponentFixture<ViewCompetitonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCompetitonPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCompetitonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
