import {Component} from '@angular/core';
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
    FormsModule
  ],
  templateUrl: './association-members-page-component.component.html',
  styleUrl: './association-members-page-component.component.css'
})
export class AssociationMembersPageComponentComponent {
  userAssociations: UserAssociation[] = [];
  userRoles: AssociationRole[] = []
  activeTab: Tab = Tab.MEMBERS; // Default active tab
  faTrashCan = faTrashCan;
  showModifyMemberModal = false;
  selectedUser: UserAssociation | undefined;
  selectedRole!: string;
  associationID: string;

  setActiveTab(tab: Tab) {
    this.activeTab = tab;
  }
  constructor(
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    protected modalService: ModalService) {
    this.associationID = route.snapshot.params['associationID'];
    navigationService.showNavigation();
    this.translate.get('associationMembers.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQLCommunication.getAssociationMembers(this.associationID).subscribe({
      next: (response) => {
        console.log('r')
        console.log(response)
        this.userAssociations = response.data.getAssociationDetails.users
    }
    })

    this.graphQLCommunication.getAssociationRoles().subscribe({
      next: (response) => {
        this.userRoles = response.data.getAssociationRoles
      }
    })

    this.modalService.modalVisibilityEvent.subscribe({
      next: (modalChange: ModalChange) => {
        if(modalChange.modal == Modal.ASSOCIATION_MEMBERS_MODIFY_MEMBER)
          this.showModifyMemberModal = (modalChange.status === ModalStatus.OPEN);
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

  public  updateUserRole() {

    const selectedRoleObj = this.userRoles.find(role => role.name === this.selectedRole);
    if (selectedRoleObj) {
      console.log("Asso " + this.associationID)
      console.log("USer " + this.selectedUser!.user.id)
      console.log("Select " + selectedRoleObj.id)
      this.graphQLCommunication.changeUserAssociation(this.associationID, this.selectedUser!.user.id, selectedRoleObj.id)
        .subscribe({
          next: (response) => {
            console.log(response)
          }
        })
    } else {
      // op de een of andere manier is de rol nergens meer de bekennen
    }
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_MODIFY_MEMBER)
  }
  protected readonly Modal = Modal;
}
