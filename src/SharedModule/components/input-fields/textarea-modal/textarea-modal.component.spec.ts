import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaModalComponent } from './textarea-modal.component';

describe('TextareaModalComponent', () => {
  let component: TextareaModalComponent;
  let fixture: ComponentFixture<TextareaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextareaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
