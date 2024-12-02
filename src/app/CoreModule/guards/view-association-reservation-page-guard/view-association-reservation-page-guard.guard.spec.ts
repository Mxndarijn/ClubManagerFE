import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { viewAssociationReservationPageGuardGuard } from './view-association-reservation-page-guard.guard';

describe('viewAssociationReservationPageGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => viewAssociationReservationPageGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
