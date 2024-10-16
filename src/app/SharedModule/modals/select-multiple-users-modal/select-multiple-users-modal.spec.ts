import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultipleUsersModal } from './select-multiple-users-modal';

describe('CompetitionMemberOverviewModalComponent', () => {
  let component: SelectMultipleUsersModal;
  let fixture: ComponentFixture<SelectMultipleUsersModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMultipleUsersModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMultipleUsersModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
