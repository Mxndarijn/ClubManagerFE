import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionDetailsPage } from './competition-details-page';

describe('ViewCompetitonPageComponent', () => {
  let component: CompetitionDetailsPage;
  let fixture: ComponentFixture<CompetitionDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
