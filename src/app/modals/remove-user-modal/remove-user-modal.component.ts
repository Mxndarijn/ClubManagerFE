import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {NavigationService} from "../../services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../services/modal.service";
import {AssociationMembersPageComponent} from "../../pages/association-members-page/association-members-page.component";
import {AlertService} from "../../services/alert.service";
import {UserAssociation} from "../../../model/user-association.model";
import {AssociationRole} from "../../../model/association-role.model";
import {ChangeUserAssociationResponseDTO} from "../../../model/dto/change-user-association-response-dto.model";
import {AlertInfo} from "../../alerts/alert-manager/alert-manager.component";
import {AlertIcon} from "../../alerts/alert-info/alert-info.component";
import {DefaultBooleanResponseDTO} from "../../../model/dto/default-boolean-response-dto";

@Component({
  selector: 'app-remove-user-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './remove-user-modal.component.html',
  styleUrl: './remove-user-modal.component.css'
})
export class RemoveUserModalComponent {
  showModifyMemberModal: boolean = false;
  @Input() selectedUser: UserAssociation | undefined;

  @Output() userAssociationDeletedEvent: EventEmitter<UserAssociation> = new EventEmitter<UserAssociation>();


  constructor(
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private associationMembersPage: AssociationMembersPageComponent,
    private alertService: AlertService
  ) {

    this.modalService.modalVisibilityEvent.subscribe({
      next: (modalChange: ModalChange) => {
        if (modalChange.modal == Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER)
          this.showModifyMemberModal = (modalChange.status === ModalStatus.OPEN);
      }
    })
  }

  protected removeUser() {
    this.graphQLCommunication.deleteUserAssociation(this.associationMembersPage.associationID, this.selectedUser!.user.id)
      .subscribe({
        next: (response) => {
          console.log(response)
          const changedUserDTO: DefaultBooleanResponseDTO = response.data.removeUserAssociation;
          if (changedUserDTO.success) {
            this.userAssociationDeletedEvent.emit(this.selectedUser)
            const alert: AlertInfo = {
              duration: 4000,
              title: "Verwijderd",
              subTitle: this.selectedUser?.user.fullName + "is succesvol verwijderd uit de vereniging.",
              alertClass: "border-success",
              icon: AlertIcon.CHECK

            }
            this.alertService.showAlert(alert)

          }
        }
      })
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER)
  }

  protected cancelDeletingUser() {
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_REMOVE_MEMBER)
  }
}
