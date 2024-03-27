import {Injectable} from '@angular/core';
import {GraphQLCommunication} from "./graphql-communication.service";
import {AuthenticationService} from "./authentication.service";
import {BehaviorSubject} from "rxjs";
import {AccountPermission} from "../models/account-role.model";
import {UserAssociation} from "../models/user-association.model";
import {AssociationPermission} from "../enums/association-permission";


@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  private accountPermissions: AccountPermission[];
  associationPermissionsSubject = new BehaviorSubject<UserAssociation[]>([]);
  public readonly associationPermissions$ = this.associationPermissionsSubject.asObservable();



  constructor(private graphQL: GraphQLCommunication, authService: AuthenticationService) {
    this.accountPermissions = [];
    authService.isLoggedIn().then(loggedIn => {
      this.refreshPermissions();
    })
  }

  async refreshPermissions() {
    this.graphQL.getMyPermissions().subscribe({
      next: (response) => {
        if(response.data == null)
          return;
        this.accountPermissions = response.data.getMyProfile.role.permissions
      },
    })

    this.graphQL.getMyAssociationPermissions().subscribe({
      next: (response: any) => {
        if(response.data == null)
          return;
        this.associationPermissionsSubject.next(response.data.getMyProfile.associations);
      },
    })
  }


  async hasAssociationPermission(id: string, perm: AssociationPermission) {
    if (perm === AssociationPermission.NO_PERMISSION) {
      return true;
    }
    const userAssociation = this.associationPermissionsSubject.getValue().find(ua => ua.association.id === id);

    if (!userAssociation) {
      return false;
    }

    return userAssociation.associationRole.permissions.some(p => p.name === perm);

  }
}
