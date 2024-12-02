import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {
  DateTimeSelectorComponent
} from "../../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {
  InputFieldSingleSelectDataSource
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select-datasource";
import {BehaviorSubject} from "rxjs";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {
  AssociationGuest, AssociationGuestResponseDTO,
  AssociationGuestStatus, AssociationGuestVerificationType
} from "../../../../CoreModule/models/dto/association-guest-response-dto";
import {NgClass} from "@angular/common";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";

@Component({
  selector: 'app-review-association-guest-modal',
  standalone: true,
  imports: [
    CustomButton,
    DateTimeSelectorComponent,
    DefaultInputFieldComponent,
    FormsModule,
    InputFieldSingleSelectComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './review-association-guest-modal.component.html',
  styleUrl: './review-association-guest-modal.component.css'
})
export class ReviewAssociationGuestModalComponent extends DefaultModalInformation{

  @Output() AssociationGuestChanged = new EventEmitter<AssociationGuest>();
  @Input() selectedAssociationGuest?: AssociationGuest;

  protected readonly ButtonSize = ButtonSize;
  protected readonly ButtonClass = ButtonClass;
  singleSelectInputFieldDataSourceStatus: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Selecteer een status.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "Status",
    processItem(input: AssociationGuestStatus): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input);
      });
    }
  }

  constructor(
    modalService: ModalService,
    private route: ActivatedRoute,
    private graphQLService: GraphQLCommunication,
    private alertService: AlertService,
    private util: UtilityFunctions
  ) {
    super(Modal.GUEST_CHANGE_GUEST, modalService);
    this.title = "Aanvraag Introducee";

    this.singleSelectInputFieldDataSourceStatus.items.next(UtilityFunctions.getEnumList(AssociationGuestStatus))
  }

  changeGuest() {
    if(!this.selectedAssociationGuest) {
      return;
    }
    if(!this.singleSelectInputFieldDataSourceStatus.formControl.valid) {
      return;
    }
    this.hideModal();
    this.graphQLService.changeAssociationGuestStatus(this.selectedAssociationGuest.id, this.selectedAssociationGuest.association.id, this.singleSelectInputFieldDataSourceStatus.formControl.value).then((response : AssociationGuestResponseDTO) => {
      if (response.success) {
        this.AssociationGuestChanged.emit(response.associationGuest);
        this.alertService.showAlert({
          title: "Succesvol",
          subTitle: "De aanvraag is succesvol beoordeeld.",
          icon: AlertIcon.CHECK,
          duration: 4000,
          alertClass: AlertClass.CORRECT_CLASS
        });
      } else {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is iets fout gegaan, probeer het later nog eens.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    }).catch((error) => {
      console.error(error)
    });

  }
}
