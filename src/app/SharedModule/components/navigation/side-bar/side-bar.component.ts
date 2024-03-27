import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SideBarIconStandard, SideBarItemComponent } from '../side-bar-item/side-bar-item.component';
import {AssociationNameComponent} from "../../../../app/SharedModule/components/association-name/association-name.component";
import {ConfirmButtonComponent} from "../../../../app/SharedModule/components/buttons/confirm-button/confirm-button.component";
import {RouterOutlet} from "@angular/router";
import {
  SideBarIconAssociation,
  SideBarItemAssociationComponent
} from "../side-bar-item-association/side-bar-item-association.component";
import {AssociationPermission} from "../../../../app/CoreModule/enums/association-permission";
import {Association} from "../../../../app/CoreModule/models/association.model";
import {UserAssociation} from "../../../../app/CoreModule/models/user-association.model";
import {AssociationInvite} from "../../../../app/CoreModule/models/association-invite";
import {GraphQLCommunication} from "../../../../app/CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../app/CoreModule/services/navigation.service";
import {PermissionService} from "../../../../app/CoreModule/services/permission.service";
import {environment} from "../../../../environment/environment";

//Voeg items to voor nieuwe gegevens in de nav
const STANDARD_SIDEBAR_ITEMS: SideBarIconStandard[] = [
  {
    name: "Home",
    link: "/home"
  },
  {
    name: "Mijn uitnodigingen",
    link: "/invitations"
  },
  {
    name: "Mijn reserveringen",
    link: "/myreservations"
  }
]

const ASSOCIATION_SIDEBAR_ITEMS: SideBarIconAssociation[] = [
  {
    name: "Instellingen",
    link: "settings",
    permission: AssociationPermission.MANAGE_SETTINGS
  },
  {
    name: "Leden",
    link: "members",
    permission: AssociationPermission.MANAGE_MEMBERS
  },
  {
    name: "Baan configuratie",
    link: "trackConfiguration",
    permission: AssociationPermission.MANAGE_TRACK_CONFIGURATION
  },
  {
    name: "Reserveren",
    link: "book",
    permission: AssociationPermission.NO_PERMISSION
  },
  {
    name: "Competities",
    link: "competitions",
    permission: AssociationPermission.NO_PERMISSION
  },
  {
    name: "Wapens",
    link: "weapons",
    permission: AssociationPermission.MANAGE_WEAPONS
  },

]
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, SideBarItemComponent, AssociationNameComponent, ConfirmButtonComponent, RouterOutlet, SideBarItemAssociationComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})

export class SideBarComponent implements OnInit {
  standard_sidebar_items = STANDARD_SIDEBAR_ITEMS;
  association_sidebar_items: SideBarIconAssociation[] = ASSOCIATION_SIDEBAR_ITEMS
  protected readonly environment = environment;
  associations: Association[] = [];
  public isVisible: boolean = false;
  associationPermissions: UserAssociation[] = [];
  associationInvitesList: AssociationInvite[] = [];

  constructor(
        private graphQLCommunication: GraphQLCommunication, navigationService: NavigationService,
        protected permissionService: PermissionService) {
    navigationService.NavigationVisibilityChangedEvent.subscribe({
      next: (visible: boolean) => {
        this.isVisible = visible;
      }
    });
    navigationService.NavigationReloadEvent.subscribe({
      next: ()=> {
        this.reload()
      }
    })
    this.reload()
  }



  ngOnInit() {
    this.associationPermissions = this.permissionService.associationPermissionsSubject.getValue();

    // Subscribe to future changes
    this.permissionService.associationPermissions$.subscribe({
      next: (p) => {
        this.associationPermissions = p;
      }
    });
  }

  hasAssociationPermission(associationID: string, perm: string): boolean {
    if (perm === AssociationPermission.NO_PERMISSION) {
      return true;
    }
    const userAssociation = this.associationPermissions.find(ua => ua.association.id === associationID);

    if (!userAssociation) {
      return false;
    }

    return userAssociation.associationRole.permissions.some(p => p.name === perm);
  }


  private reload() {
    this.graphQLCommunication.getMyAssociations().subscribe({
      next: (response) => {
        if(response.data == null)
          return;
        this.associations = response.data.getMyProfile.associations.map((assoc: UserAssociation) => assoc.association);
      },
      error: (error) => {
      }
    });

    this.graphQLCommunication.getUserInvites().subscribe({
      next: (response) => {
        this.associationInvitesList = response.data.getMyProfile.invites
      }
    });
  }
}
