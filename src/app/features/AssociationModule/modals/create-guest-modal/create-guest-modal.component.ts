import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  InputFieldWeaponModalComponent
} from "../../../../SharedModule/components/input-fields/inputfield-weapon-modal/input-field-weapon-modal.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  TextareaModalComponent
} from "../../../../SharedModule/components/input-fields/textarea-modal/textarea-modal.component";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {WeaponType} from "../../../../CoreModule/models/weapon-type.model";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";
import {ActivatedRoute} from "@angular/router";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {AssociationGuestVerificationType} from "../../../../CoreModule/models/dto/association-guest-response-dto";
import {Association} from "../../../../CoreModule/models/association.model";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {
  InputFieldSingleSelectDataSource
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select-datasource";
import {BehaviorSubject} from "rxjs";
import {UserAssociation} from "../../../../CoreModule/models/user-association.model";
import {
  InputFieldSingleSelectComponent
} from "../../../../SharedModule/components/input-fields/input-field-single-select/input-field-single-select.component";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {UtilityFunctions} from "../../../../SharedModule/utilities/utility-functions";
import {
  DateTimeSelectorComponent
} from "../../../../SharedModule/components/input-fields/date-time-selector/date-time-selector.component";

@Component({
  selector: 'app-create-guest-modal',
  standalone: true,
  imports: [
    FormsModule,
    InputFieldWeaponModalComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TextareaModalComponent,
    NgClass,
    InputFieldSingleSelectComponent,
    DefaultInputFieldComponent,
    DateTimeSelectorComponent
  ],
  templateUrl: './create-guest-modal.component.html',
  styleUrl: './create-guest-modal.component.css'
})
export class CreateGuestModalComponent extends DefaultModalInformation {

  protected createGuestForm: FormGroup<{
    guestName: FormControl<string | null>;
    guestResidence: FormControl<string | null>;
    guestVerificationType: FormControl<AssociationGuestVerificationType | null>;
    guestVerificationCode: FormControl<string | null>;
    eventTime: FormControl<string | null>;
    association: FormControl<Association | null>;
  }>;

  singleSelectInputFieldDataSourceAssociation: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Selecteer een vereniging.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "",
    processItem(input: UserAssociation): Promise<any> {
      return new Promise((resolve, reject) => {
        resolve(input.association.name);
      });
    }
  }

  singleSelectInputFieldDataSourceVerificationType: InputFieldSingleSelectDataSource = {
    errorSetting: {
      errorMessage: 'Selecteer een legitimatie optie.',
      errorName: ''
    },
    formControl: new FormControl(null, Validators.required),
    hideErrorsWhenEmpty: false,
    items: new BehaviorSubject<any[]>([]),
    label: "",
    processItem(input: AssociationGuestVerificationType): Promise<any> {
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
    super(Modal.GUEST_CREATE_GUEST, modalService);

    this.graphQLService.getMyAssociationsWithoutImage().then(response => {
      this.singleSelectInputFieldDataSourceAssociation.items.next(response.associations);
    })

    this.singleSelectInputFieldDataSourceVerificationType.items.next(UtilityFunctions.getEnumList(AssociationGuestVerificationType))

    // @ts-ignore
    this.createGuestForm = new FormGroup({
      guestName: new FormControl<string | null>(null, [Validators.required, ValidationUtils.containsSpace]),
      guestResidence: new FormControl<string | null>(null, [Validators.required]),
      guestVerificationCode: new FormControl<string | null>(null, [Validators.required]),
      eventTime: new FormControl<string | null>(null, [Validators.required, ValidationUtils.isDatePresentOrFuture]),
      guestVerificationType: new FormControl<AssociationGuestVerificationType | null>(null, [Validators.required]),
      association: new FormControl<Association | null>(null, [Validators.required]),
    });

  }

}
