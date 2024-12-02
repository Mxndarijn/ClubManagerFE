import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {PermissionService} from "../../services/permission.service";
import {AuthenticationService} from "../../services/authentication.service";
import {AssociationPermission} from "../../enums/association-permission";

export const viewAssociationReservationPageGuardGuard: CanActivateFn = async (route, state) => {
  const permissionService = inject(PermissionService);
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const id = route.params['associationID'];
  const hasPermission = await permissionService.hasAssociationPermission(id, AssociationPermission.VIEW_RESERVATIONS);

  if (!hasPermission) {
    await router.navigate(['/home']);
  }

  return hasPermission;
};
