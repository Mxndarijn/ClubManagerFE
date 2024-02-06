import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrackModalComponent } from './create-track-modal.component';

describe('CreateTrackModalComponent', () => {
  let component: CreateTrackModalComponent;
  let fixture: ComponentFixture<CreateTrackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTrackModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTrackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
