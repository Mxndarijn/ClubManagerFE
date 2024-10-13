import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionCreateUserScores } from './competition-create-user-scores';

describe('CreateCompetitionModalComponent', () => {
  let component: CompetitionCreateUserScores;
  let fixture: ComponentFixture<CompetitionCreateUserScores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionCreateUserScores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionCreateUserScores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
