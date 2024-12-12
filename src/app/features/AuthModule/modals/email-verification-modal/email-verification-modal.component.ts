import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../../../CoreModule/services/modal.service";
import {
  DefaultInputFieldComponent, InputFieldWidth
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {TranslateModule} from "@ngx-translate/core";
import {
  SingleErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {
  ErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/error-message/error-message.component";


@Component({
  selector: 'app-email-verification-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    CustomButton,
    DefaultInputFieldComponent,
    NgSwitch,
    NgSwitchCase,
    NgForOf,
    TranslateModule,
    SingleErrorMessageComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './email-verification-modal.html',
  styleUrl: './email-verification-modal.css'
})
export class EmailVerificationModalComponent extends DefaultModalInformation implements OnInit {

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  showEmailErrorMessage: boolean = false;



  constructor(
    private modalService: ModalService,
    private graphQL: GraphQLCommunication,
    private alertService: AlertService
  ) {
    super(Modal.EMAIL_VERIFICATION, modalService);
    this.formControl = new FormControl("", Validators.compose([Validators.required, Validators.email]));
  }

  ngOnInit(): void {
    this.showEmailErrorMessage = false
    this.formControl.reset();
  }

  formControl: FormControl<String | null>;


  cancelFunction() {
    this.hideModal()
  }

  protected readonly InputFieldWidth = InputFieldWidth;
}
