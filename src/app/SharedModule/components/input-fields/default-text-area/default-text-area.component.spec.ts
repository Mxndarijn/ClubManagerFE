import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultTextAreaComponent } from './default-text-area.component';

describe('DefaultTextAreaComponent', () => {
  let component: DefaultTextAreaComponent;
  let fixture: ComponentFixture<DefaultTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultTextAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
