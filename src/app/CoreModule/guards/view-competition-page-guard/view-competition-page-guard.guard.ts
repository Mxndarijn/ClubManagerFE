import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthenticationService} from "../../services/authentication.service";
import {AssociationPermission} from "../../enums/association-permission";
import {PermissionService} from "../../services/permission.service";

export const viewCompetitionPageGuardGuard: CanActivateFn = async (route, state) => {
  const permissionService = inject(PermissionService);
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const id = route.params['associationID'];
  const hasPermission = await permissionService.hasAssociationPermission(id, AssociationPermission.VIEW_COMPETITIONS);

  if (!hasPermission) {
    await router.navigate(['/home']);
  }

  return hasPermission;
};
