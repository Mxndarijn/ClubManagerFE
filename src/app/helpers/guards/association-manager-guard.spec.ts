
import { AuthenticationService } from '../../services/authentication.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {Observable} from "rxjs";
import {PermissionService} from "../../services/permission.service";
import {AssociationPermission} from "../permission/association-permission";
import {authGuard} from "./auth.guard";

@Injectable({
  providedIn: 'root',
})
export class AssociationManagerGuard {
  constructor(
    private permissionService: PermissionService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const id = route.params['associationID'];
    const hasPermission = await this.permissionService.hasAssociationPermission(id, AssociationPermission.MANAGE_MEMBERS);
    if (!hasPermission) {
      if(await this.authService.isLoggedIn())
        await this.router.navigate(['/home']);
      else
        await this.router.navigate(['/login'])
    }

    return hasPermission;
  }
}
