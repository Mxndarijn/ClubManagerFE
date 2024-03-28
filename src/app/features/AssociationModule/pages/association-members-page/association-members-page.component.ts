import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {map, Observable} from "rxjs";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {UpdateUserModalComponent} from "../../modals/update-user-modal/update-user-modal.component";
import {SendInvitationModalComponent} from "../../modals/send-invitation-modal/send-invitation-modal.component";
import {SearchBoxComponent} from "../../../../SharedModule/components/input-fields/search-box/search-box.component";
import {
  ConfirmationModalComponent
} from "../../../../SharedModule/modals/confirmation-modal/confirmation-modal.component";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {AssociationInvite, AssociationInviteID} from "../../../../CoreModule/models/association-invite";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertInfo} from "../../../../SharedModule/components/alerts/alert-manager/alert-manager.component";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";

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
    SearchBoxComponent,
    SendInvitationModalComponent,
    ConfirmationModalComponent,
    TranslateModule
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
  protected associationName: string = "";

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
    private authService: AuthenticationService,) {
    this.associationID = route.snapshot.params['associationID'];

    this.graphQLCommunication.getAssociationName(this.associationID).subscribe({
      next: (response) => {
        navigationService.setSubTitle(response.data.getAssociationDetails.name);
        this.associationName = response.data.getAssociationDetails.name;
      }
    })

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
            alertClass: AlertClass.CORRECT_CLASS,
            icon: AlertIcon.CHECK

          }
          this.alertService.showAlert(alert)
        } else {
          // error message
          const alert: AlertInfo = {
            duration: 4000,
            title: "Error fout opgetreden",
            subTitle: "Er is iets misgegaan bij het intrekken van de uitnodiging.",
            alertClass: AlertClass.INCORRECT_CLASS,
            icon: AlertIcon.XMARK

          }
          this.alertService.showAlert(alert)
        }
      },
      error: (e) => {
        const alert: AlertInfo = {
          duration: 4000,
          title: "Error",
          subTitle: "Er is een fout opgetreden bij het intrekken van de uitnodiging.",
          alertClass: AlertClass.INCORRECT_CLASS,
          icon: AlertIcon.XMARK

        }
        this.alertService.showAlert(alert)
    }
    });

  }

  createNewAssociationInvite() {
    this.modalService.showModal(Modal.ASSOCIATION_MEMBERS_CREATE_INVITE);
  }

  newAssociationInviteEvent(associationInvite: AssociationInvite) {
    this.associationInvites.push(associationInvite);
  }

  protected readonly Modal = Modal;

  removeUser() {
    this.graphQLCommunication.deleteUserAssociation(this.associationID, this.selectedUser!.user.id)
      .subscribe({
        next: (response) => {
          const changedUserDTO: DefaultBooleanResponseDTO = response.data.removeUserAssociation;
          if (changedUserDTO.success) {
            this.userAssociationDeleted(this.selectedUser!)
            const alert: AlertInfo = {
              duration: 4000,
              title: "Verwijderd",
              subTitle: this.selectedUser?.user.fullName + "is succesvol verwijderd uit de vereniging.",
              alertClass: AlertClass.CORRECT_CLASS,
              icon: AlertIcon.CHECK

            }
            this.alertService.showAlert(alert)

          }
        }
      })
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER)
  }

  cancelRemoveUser() {
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER)
  }
}
