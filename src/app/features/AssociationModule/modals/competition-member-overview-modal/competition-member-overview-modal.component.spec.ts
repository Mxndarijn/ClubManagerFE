import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionMemberOverviewModalComponent } from './competition-member-overview-modal.component';

describe('CompetitionMemberOverviewModalComponent', () => {
  let component: CompetitionMemberOverviewModalComponent;
  let fixture: ComponentFixture<CompetitionMemberOverviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionMemberOverviewModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompetitionMemberOverviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
