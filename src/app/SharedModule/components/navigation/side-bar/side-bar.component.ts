import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SideBarIconStandard, SideBarItemComponent } from '../side-bar-item/side-bar-item.component';
import {RouterOutlet} from "@angular/router";
import {
  SideBarIconAssociation,
  SideBarItemAssociationComponent
} from "../side-bar-item-association/side-bar-item-association.component";
import {AssociationPermission} from "../../../../CoreModule/enums/association-permission";
import {AssociationNameComponent} from "../../association-name/association-name.component";
import {ConfirmButtonComponent} from "../../buttons/confirm-button/confirm-button.component";
import {environment} from "../../../../../environment/environment";
import {Association} from "../../../../CoreModule/models/association.model";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {AssociationInvite} from "../../../../CoreModule/models/association-invite";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {PermissionService} from "../../../../CoreModule/services/permission.service";

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
  },
  {
    name: "Mijn Presenties",
    link: "/my-presences"
  },
  {
    name: "Mijn Introducees",
    link: "/my-guests"
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
    name: "Presentie",
    link: "presence",
    permission: AssociationPermission.MANAGE_TRACK_CONFIGURATION // TODO CHANGE
  },
  {
    name: "Reserveren",
    link: "book",
    permission: AssociationPermission.VIEW_RESERVATIONS
  },
  {
    name: "Competities",
    link: "competition",
    permission: AssociationPermission.VIEW_COMPETITIONS
  },
  {
    name: "Wapens",
    link: "weapons",
    permission: AssociationPermission.MANAGE_WEAPONS
  },
  {
    name: "Introducees",
    link: "guests",
    permission: AssociationPermission.REVIEW_ASSOCIATION_GUEST
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
  associationInvitesList: AssociationInvite[] | undefined = [];

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
    0

    if (perm === AssociationPermission.NO_PERMISSION) {
      return true;
    }
    const userAssociation = this.associationPermissions.find(ua => ua.association.id === associationID);

    if (!userAssociation) {
      return false;
    }

    return userAssociation.associationRoles.some(p => {
      return p.permissions.some(permission => permission.name === perm)
    });
  }


  private reload() {
    this.graphQLCommunication.getMyAssociations().then(r =>{
        this.associations = r.associations.map((assoc: UserAssociation) => assoc.association);
    });

    this.graphQLCommunication.getUserInvites().then(r =>{
        this.associationInvitesList = r
    });
  }
}
