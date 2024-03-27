import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {AssociationRole} from "../../CoreModule/models/association-role.model";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../CoreModule/services/modal.service";
import {AssociationMembersPageComponent} from "../../pages/association-members-page/association-members-page.component";
import {AlertService} from "../../CoreModule/services/alert.service";
import {
  SingleErrorMessageComponent
} from "../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {AlertInfo} from "../../SharedModule/components/alerts/alert-manager/alert-manager.component";
import {AlertClass, AlertIcon} from "../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AssociationInvite} from "../../CoreModule/models/association-invite";
import {SendAssociationInviteResponseDTO} from "../../CoreModule/models/dto/send-association-invite-response-dto";

@Component({
  selector: 'app-send-invitation-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    SingleErrorMessageComponent
  ],
  templateUrl: './send-invitation-modal.component.html',
  styleUrl: './send-invitation-modal.component.css'
})
export class SendInvitationModalComponent {
  showModal: boolean = false;
  @Input() selectedRole: string = "User";
  @Input() associationName: string = "";
  userRoles: AssociationRole[] = [];
  emailFormControl: FormControl
  private associationID: string;
  @Output()
  public NewAssociationInviteEvent = new EventEmitter<AssociationInvite>();

  constructor(
    private graphQLCommunication: GraphQLCommunication,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private associationMembersPage: AssociationMembersPageComponent,
    private alertService: AlertService,

  ) {
    this.associationID = route.snapshot.params['associationID'];
    this.emailFormControl = new FormControl<string>('', [Validators.email]);

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
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_CREATE_INVITE);
    this.emailFormControl.reset();

  }

  sendInvitation() {
  if(!this.emailFormControl.valid) {
    return;
  }
  const selectedRoleObj = this.userRoles.find(role => role.name === this.selectedRole);
  if (!selectedRoleObj) {
    return;
  }
  this.graphQLCommunication.createAssociationInvite(this.associationID, this.emailFormControl.value,selectedRoleObj.id )
    .subscribe({
      next: (response) => {
        console.log(response)
        const dto: SendAssociationInviteResponseDTO = response.data.sendAssociationInvite;
        this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_CREATE_INVITE)
        if(dto.success) {
          const alert: AlertInfo = {
            title: "Succesvol",
            subTitle: "De uitnodiging is succesvol verstuurd.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          }
          this.alertService.showAlert(alert);
          this.NewAssociationInviteEvent.emit(dto.associationInvite)

        } else {
          const alert: AlertInfo = {
            title: "Fout opgetreden",
            subTitle: "",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          }
          switch (dto.message) {
            case "user-not-found":
              alert.subTitle = "Er is geen gebruiker met dit emailadres gevonden."
              this.alertService.showAlert(alert);
              break;
            case "already-in-association":
              alert.subTitle = "Deze gebruiker zit al in " + this.associationName + ".";
              this.alertService.showAlert(alert);
              break;
            case "already-invited":
              alert.subTitle = "Deze gebruiker heeft al een uitnodiging."
              this.alertService.showAlert(alert);
              break;
            default:
              alert.subTitle = "Er is onbekende fout opgetreden."
              this.alertService.showAlert(alert);
              break;


          }
        }
      },
      error: (e) => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Probeer het later opnieuw.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    })
    this.emailFormControl.reset();
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_CREATE_INVITE)

  }
}
