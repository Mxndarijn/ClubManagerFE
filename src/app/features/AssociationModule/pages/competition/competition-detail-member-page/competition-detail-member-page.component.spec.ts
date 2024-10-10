import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionDetailMemberPageComponent } from './competition-detail-member-page.component';

describe('CompetitionDetailMemberPageComponent', () => {
  let component: CompetitionDetailMemberPageComponent;
  let fixture: ComponentFixture<CompetitionDetailMemberPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionDetailMemberPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompetitionDetailMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
