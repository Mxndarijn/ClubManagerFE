import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleErrorMessageComponent } from './single-error-message.component';

describe('SingleErrorMessageComponent', () => {
  let component: SingleErrorMessageComponent;
  let fixture: ComponentFixture<SingleErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleErrorMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
