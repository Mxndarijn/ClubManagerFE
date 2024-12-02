import {Injectable} from '@angular/core';
import {GraphQLCommunication} from "./graphql-communication.service";
import {AuthenticationService} from "./authentication.service";
import {BehaviorSubject, filter, first, lastValueFrom, of, switchMap} from "rxjs";
import {AccountPermission} from "../models/account-role.model";
import {UserAssociation} from "../models/user-association.model";
import {AssociationPermission} from "../enums/association-permission";


@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  private accountPermissions: AccountPermission[];
  private permissionsLoaded = new BehaviorSubject<boolean>(false);
  associationPermissionsSubject = new BehaviorSubject<UserAssociation[]>([]);
  public readonly associationPermissions$ = this.associationPermissionsSubject.asObservable();



  constructor(private graphQL: GraphQLCommunication, authService: AuthenticationService) {
    this.accountPermissions = [];
    this.permissionsLoaded.next(false);
    authService.isLoggedIn().then(loggedIn => {
      if(!loggedIn)
        return
      this.refreshPermissions();
    })
  }

  async refreshPermissions() {
    const [permissions, associationPermissions] = await Promise.all([
      this.graphQL.getMyPermissions(),
      this.graphQL.getMyAssociationPermissions()
    ]);

    this.accountPermissions = permissions.role.permissions;
    this.associationPermissionsSubject.next(associationPermissions.associations);
    this.permissionsLoaded.next(true);
  }


  async hasAssociationPermission(id: string, perm: AssociationPermission): Promise<boolean> {
    if (perm === AssociationPermission.NO_PERMISSION) {
      return true;
    }

    return lastValueFrom(
      this.permissionsLoaded.pipe(
        filter(loaded => loaded),
        first(),
        switchMap(() => {
          const associations = this.associationPermissionsSubject.getValue();
          const userAssociation = associations.find(ua => ua.association.id === id);

          if (!userAssociation) {
            return of(false);
          }

          const hasPermission = userAssociation.associationRoles.some(p => {
            return p.permissions.some(pe => pe.name === perm);

          })
          return of(hasPermission);
        })
      )
    );
  }

}
