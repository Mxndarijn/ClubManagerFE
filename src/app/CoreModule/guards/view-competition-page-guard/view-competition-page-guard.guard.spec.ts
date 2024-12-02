import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { viewCompetitionPageGuardGuard } from './view-competition-page-guard.guard';

describe('viewCompetitionPageGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => viewCompetitionPageGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
