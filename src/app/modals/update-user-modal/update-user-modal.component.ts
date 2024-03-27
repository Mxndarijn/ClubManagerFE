import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {UserAssociation} from "../../CoreModule/models/user-association.model";
import {AssociationRole} from "../../CoreModule/models/association-role.model";
import {ChangeUserAssociationResponseDTO} from "../../CoreModule/models/dto/change-user-association-response-dto.model";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {NavigationService} from "../../CoreModule/services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../CoreModule/services/modal.service";
import {AssociationMembersPageComponent} from "../../pages/association-members-page/association-members-page.component";
import {AlertService} from "../../CoreModule/services/alert.service";
import {AlertInfo} from "../../SharedModule/components/alerts/alert-manager/alert-manager.component";
import {AlertClass, AlertIcon} from "../../SharedModule/components/alerts/alert-info/alert-info.component";

@Component({
  selector: 'app-update-user-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './update-user-modal.component.html',
  styleUrl: './update-user-modal.component.css'
})
export class UpdateUserModalComponent {
  showModifyMemberModal: boolean = false;
  @Input() selectedUser: UserAssociation | undefined;
  @Input() selectedRole: string | undefined;
  userRoles: AssociationRole[] = [];

  @Output() updateUserAssociationEvent= new EventEmitter<UserAssociation>();

  constructor(
    private graphQLCommunication: GraphQLCommunication,
    navigationService: NavigationService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    protected modalService: ModalService,
    private associationMembersPage: AssociationMembersPageComponent,
    private alertService: AlertService
  ) {
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
  protected updateUserRole() {
    const selectedRoleObj = this.userRoles.find(role => role.name === this.selectedRole);
    if (selectedRoleObj) {
      this.graphQLCommunication.changeUserAssociation(this.associationMembersPage.associationID, this.selectedUser!.user.id, selectedRoleObj.id)
        .subscribe({
          next: (response) => {
            const changedUserDTO: ChangeUserAssociationResponseDTO = response.data.changeUserAssociation
            if(changedUserDTO.success) {
              this.updateUserAssociationEvent.emit(changedUserDTO.userAssociation)
              const alert: AlertInfo = {
                duration: 4000,
                title: "Succesvol",
                subTitle:"De rol van "+  this.selectedUser?.user.fullName + " is succesvol verandert.",
                alertClass: AlertClass.CORRECT_CLASS,
                icon: AlertIcon.CHECK

              }
              this.alertService.showAlert(alert)

            }
          }
        })
    } else {
      const alert: AlertInfo = {
        duration: 4000,
        title: "Fout opgetreden",
        subTitle: "Er is iets mis gegaan bij het bewerken van " + this.selectedUser?.user.fullName + "",
        alertClass: AlertClass.INCORRECT_CLASS,
        icon: AlertIcon.XMARK
      }
      this.alertService.showAlert(alert)
      // op de een of andere manier is de rol nergens meer de bekennen
    }
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_MODIFY_MEMBER)
  }
}
