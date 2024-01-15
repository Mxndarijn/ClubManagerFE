import {Component, ViewChild} from '@angular/core';
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {NavigationService} from "../../services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {UserAssociation} from "../../../model/user-association.model";
import {ActivatedRoute} from "@angular/router";
import {map, Observable} from "rxjs";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../services/modal.service";
import {AssociationRole} from "../../../model/association-role.model";
import {FormsModule} from "@angular/forms";
import {ChangeUserAssociationResponseDTO} from "../../../model/dto/change-user-association-response-dto.model";
import {UpdateUserModalComponent} from "../../modals/update-user-modal/update-user-modal.component";
import {AuthenticationService} from "../../services/authentication.service";
import {RemoveUserModalComponent} from "../../modals/remove-user-modal/remove-user-modal.component";
import {SearchBoxComponent} from "../../input-fields/search-box/search-box.component";
import {AssociationInvite, AssociationInviteID} from "../../../model/association-invite";
import {DefaultBooleanResponseDTO} from "../../../model/dto/default-boolean-response-dto";
import {AlertInfo} from "../../alerts/alert-manager/alert-manager.component";
import {AlertIcon} from "../../alerts/alert-info/alert-info.component";
import {AlertService} from "../../services/alert.service";
import {SendInvitationModalComponent} from "../../modals/send-invitation-modal/send-invitation-modal.component";

enum Tab {
  MEMBERS,
  INVITATIONS
}

@Component({
  selector: 'app-association-members-page-component',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    FaIconComponent,
    NgClass,
    FormsModule,
    UpdateUserModalComponent,
    RemoveUserModalComponent,
    SearchBoxComponent,
    SendInvitationModalComponent
  ],
  templateUrl: './association-members-page.component.html',
  styleUrl: './association-members-page.component.css'
})
export class AssociationMembersPageComponent {
  userAssociations: UserAssociation[] = [];
  filteredAssociations: UserAssociation[] = [];
  associationID: string;
  selectedUser: UserAssociation | undefined;
  selectedRole: string | undefined;
  userID: string | null;

  associationInvites:AssociationInvite[] = [];

  private latestSearchParam: string = "";

  activeTab: Tab = Tab.MEMBERS;

  faTrashCan = faTrashCan;



  setActiveTab(tab: Tab) {
    this.activeTab = tab;
  }
  constructor(
    private alertService: AlertService,
  private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    route: ActivatedRoute,
    protected modalService: ModalService,
    private authService: AuthenticationService) {
    this.associationID = route.snapshot.params['associationID'];
    navigationService.showNavigation();
    this.translate.get('associationMembers.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.userID = this.authService.getUserID();
    this.graphQLCommunication.getAssociationMembers(this.associationID).subscribe({
      next: (response) => {
        this.userAssociations = response.data.getAssociationDetails.users
        this.searchUser(this.latestSearchParam);
    }
    })

    this.graphQLCommunication.getAssociationInvites(this.associationID).subscribe({
      next: (response) => {
        console.log(response)
        this.associationInvites = response.data.getAssociationDetails.invites
      }
    })
  }

  protected readonly Tab = Tab;

  protected formatDate(dateString: string): Observable<string> {
    const date = new Date(dateString);

    return this.translate.get("config.language").pipe(
      map(locale => {
        return date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      })
    );
  }
  public changeSelectedUser(user: UserAssociation) {
    this.selectedUser = user;
    this.selectedRole = user.associationRole.name;
    this.modalService.showModal(Modal.ASSOCIATION_MEMBERS_MODIFY_MEMBER);
  }

  public deleteSelectedUser(user: UserAssociation) {
    this.selectedUser = user;
    this.modalService.showModal(Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER);
  }
  updateUserAssociation(userAssociation: UserAssociation) {
    const index = this.userAssociations.findIndex(value => value.user.id === userAssociation.user.id)
    if (index !== -1) {
      this.userAssociations[index] = userAssociation;
      this.searchUser(this.latestSearchParam);
    } else {
      // user association not found, zou niet moeteh gebeuren
    }
  }

  userAssociationDeleted(userAssociation: UserAssociation) {
    const index = this.userAssociations.findIndex(value => value.user.id === userAssociation.user.id)
    if (index !== -1) {
      this.userAssociations.splice(index, 1);
      this.searchUser(this.latestSearchParam);
    } else {
      // user association not found, zou niet moeteh gebeuren
    }
  }

  searchUser(searchValue: string) {
    console.log("search: " + searchValue)
    this.latestSearchParam = searchValue;
    this.filteredAssociations = this.userAssociations.filter(userAssociation => {
      return userAssociation.user.fullName.includes(searchValue) || userAssociation.user.email.includes(searchValue);
    });


  }

  deleteSelectedInvite(id: AssociationInviteID) {
    this.graphQLCommunication.deleteAssociationInvite(id).subscribe({
      next: (response) => {
        const responseObject: DefaultBooleanResponseDTO = response.data.removeAssociationInvite;
        if(responseObject.success) {
          const index = this.associationInvites.findIndex(value => value.id === id)
          if (index !== -1) {
            this.associationInvites.splice(index, 1);
          }
          const alert: AlertInfo = {
            duration: 4000,
            title: "Succesvol",
            subTitle: "De uitnodiging is succesvol ingetrokken.",
            alertClass: "border-error",
            icon: AlertIcon.XMARK

          }
          this.alertService.showAlert(alert)
        } else {
          // error message
          const alert: AlertInfo = {
            duration: 4000,
            title: "Error fout opgetreden",
            subTitle: "Er is iets misgegaan bij het intrekken van de uitnodiging.",
            alertClass: "border-error",
            icon: AlertIcon.XMARK

          }
          this.alertService.showAlert(alert)
        }
        console.log(response);
      },
      error: (e) => {
        const alert: AlertInfo = {
          duration: 4000,
          title: "Error",
          subTitle: "Er is een fout opgetreden bij het intrekken van de uitnodiging.",
          alertClass: "border-error",
          icon: AlertIcon.XMARK

        }
        this.alertService.showAlert(alert)
    }
    });

  }

  createNewAssociationInvite() {
    this.modalService.showModal(Modal.ASSOCIATION_MEMBERS_CREATE_INVITE);
  }
}
