import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageManualComponent } from './error-message-manual.component';

describe('ErrorMessageManualComponent', () => {
  let component: ErrorMessageManualComponent;
  let fixture: ComponentFixture<ErrorMessageManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageManualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorMessageManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
