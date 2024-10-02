import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompetitionModalComponent } from './create-competition-modal.component';

describe('CreateCompetitionModalComponent', () => {
  let component: CreateCompetitionModalComponent;
  let fixture: ComponentFixture<CreateCompetitionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCompetitionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCompetitionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
