import { Injectable } from '@angular/core';
import {GraphQLCommunication} from "./graphql-communication.service";
import {AuthenticationService} from "./authentication.service";
import {BehaviorSubject} from "rxjs";

interface AssociationPermission {
  associationUUID: string;
  associationName: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {

  private accountPermissions: string[];
  associationPermissionsSubject = new BehaviorSubject<{ [associationUUID: string]: string[] }>({});
  public readonly associationPermissions$ = this.associationPermissionsSubject.asObservable();



  constructor(private graphQL: GraphQLCommunication, authService: AuthenticationService) {
    this.accountPermissions = [];
    authService.isLoggedIn().then(loggedIn => {
      this.refreshPermissions();
    })
  }

  async refreshPermissions() {
    console.log("Refreshing permissions")
    this.graphQL.getMyPermissions().subscribe({
      next: (response) => {
        this.accountPermissions = response
      },
    })

    this.graphQL.getMyAssociationPermissions().subscribe({
      next: (response: any) => {
        const newPermissions: { [associationUUID: string]: string[] } = {};
        response.data.getMyAssociationPermissions.forEach((assocPerm: AssociationPermission) => {
          newPermissions[assocPerm.associationUUID] = assocPerm.permissions;
        });
        console.log(newPermissions)
        this.associationPermissionsSubject.next(newPermissions);
        console.log("updated?: " + this.associationPermissionsSubject.getValue())
        console.log("Permissions updated")
      },
    })
  }


}
