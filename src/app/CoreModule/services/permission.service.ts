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
    this.graphQL.getMyPermissions().then(r=>{
        this.accountPermissions = r.role.permissions
    })

    this.graphQL.getMyAssociationPermissions().then(r=>{
        this.associationPermissionsSubject.next(r.associations);
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
