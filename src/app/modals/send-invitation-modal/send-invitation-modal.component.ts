import {Component, Input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {AssociationRole} from "../../../model/association-role.model";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {NavigationService} from "../../services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../services/modal.service";
import {AssociationMembersPageComponent} from "../../pages/association-members-page/association-members-page.component";
import {AlertService} from "../../services/alert.service";
import {ErrorMessageComponent} from "../../error-messages/error-message/error-message.component";

@Component({
  selector: 'app-send-invitation-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    ErrorMessageComponent
  ],
  templateUrl: './send-invitation-modal.component.html',
  styleUrl: './send-invitation-modal.component.css'
})
export class SendInvitationModalComponent {
  showModal: boolean = false;
  @Input() selectedRole: string = "User";
  userRoles: AssociationRole[] = [];
  emailFormControl: FormControl

  constructor(
    private graphQLCommunication: GraphQLCommunication,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private associationMembersPage: AssociationMembersPageComponent,
    private alertService: AlertService,

  ) {
    this.emailFormControl = new FormControl<string>('');

    this.modalService.modalVisibilityEvent.subscribe({
      next: (modalChange: ModalChange) => {
        if (modalChange.modal == Modal.ASSOCIATION_MEMBERS_CREATE_INVITE)
          this.showModal = (modalChange.status === ModalStatus.OPEN);
      }
    })

    this.graphQLCommunication.getAssociationRoles().subscribe({
      next: (response) => {
        this.userRoles = response.data.getAssociationRoles;

        // reorder the array so 'User' is first
        this.userRoles = this.userRoles.sort((a, b) =>
          a.name === 'User' ? -1 : b.name === 'User' ? 1 : 0);
      }
    })
  }

  cancelInvitation() {

  }

  sendInvitation() {

  }
}
