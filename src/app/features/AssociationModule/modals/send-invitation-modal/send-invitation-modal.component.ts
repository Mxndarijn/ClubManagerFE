import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {AssociationMembersPageComponent} from "../../pages/association-members-page/association-members-page.component";
import {
  SingleErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {AssociationRole} from "../../../../CoreModule/models/association-role.model";
import {AssociationInvite} from "../../../../CoreModule/models/association-invite";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../../../CoreModule/services/modal.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {SendAssociationInviteResponseDTO} from "../../../../CoreModule/models/dto/send-association-invite-response-dto";
import {AlertInfo} from "../../../../SharedModule/components/alerts/alert-manager/alert-manager.component";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {CompetitionScoreType} from "../../../../CoreModule/models/association-competition";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {
  InputFieldSingleSelectDataSource
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select-datasource";
import {BehaviorSubject} from "rxjs";
import {WeaponType} from "../../../../CoreModule/models/weapon-type.model";

@Component({
  selector: 'app-send-invitation-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    SingleErrorMessageComponent,
    CustomButton,
    NgIf,
    DefaultInputFieldComponent,
    TranslateModule,
    InputFieldSingleSelectComponent
  ],
  templateUrl: './send-invitation-modal.component.html',
  styleUrl: './send-invitation-modal.component.css'
})
export class SendInvitationModalComponent {
  showModal: boolean = false;
  @Input() selectedRole: string = "User";
  @Input() associationName: string = "";
  userRoles: AssociationRole[] = [];
  emailFormControl: FormControl;
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


    this.graphQLCommunication.getAssociationRoles().then( r=>{
        this.userRoles = r;

        // reorder the array so 'User' is first
        this.userRoles = this.userRoles.sort((a, b) =>
          a.name === 'User' ? -1 : b.name === 'User' ? 1 : 0);
    })
  }

  // singleSelectInputFieldDataSource: InputFieldSingleSelectDataSource = {
  //   errorSetting: {
  //     errorMessage: 'Je moet een waarde selecteren.',
  //     errorName: ''
  //   },
  //   formControl: new FormControl(null, Validators.required),
  //   hideErrorsWhenEmpty: false,
  //   items: new BehaviorSubject<any[]>([]),
  //   label: "Selecteer hier de rol",
  //   processItem(input: AssociationRole): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //       resolve(input.name);
  //     });
  //   }
  // }

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
    .then((dto: SendAssociationInviteResponseDTO) =>{
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
    }).catch(e => {
    this.alertService.showAlert({
      title: "Fout opgetreden",
      subTitle: "Probeer het later opnieuw.",
      icon: AlertIcon.XMARK,
      duration: 4000,
      alertClass: AlertClass.INCORRECT_CLASS
    });
  })
    this.emailFormControl.reset();
    this.modalService.hideModal(Modal.ASSOCIATION_MEMBERS_CREATE_INVITE)

  }

    protected readonly ButtonClass = ButtonClass;
    protected readonly ButtonSize = ButtonSize;
  protected readonly CompetitionScoreType = CompetitionScoreType;
  protected readonly Object = Object;
}
