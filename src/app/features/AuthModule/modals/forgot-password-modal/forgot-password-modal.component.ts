import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../../../CoreModule/services/modal.service";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";


@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    CustomButton,
    DefaultInputFieldComponent,
  ],
  templateUrl: './forgot-password-modal.html',
  styleUrl: './forgot-password-modal.css'
})
export class ForgotPasswordModalComponent extends DefaultModalInformation {

  constructor(
    private modalService: ModalService,
    private graphQL : GraphQLCommunication,
    private alertService: AlertService
  ) {
    super(Modal.FORGOT_PASSWORD, modalService);
    this.formControl = new FormControl("", Validators.compose([Validators.required , Validators.email]));
  }
  formControl: FormControl <String | null>;

  acceptFunction() {
    if(this.formControl.valid) {
      this.graphQL.forgotPassword(this.formControl.value!).then(response => {
        if(!response) {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
        if(response.success) {
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: `Er is een email verstuurd naar ${this.formControl.value!}.`,
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          if(response.message == "no-user-found") {
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Gebruiker niet gevonden.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
          } else {
            this.alertService.showAlert({
              title: "Fout opgetreden",
              subTitle: "Er is een fout opgetreden.",
              icon: AlertIcon.XMARK,
              duration: 4000,
              alertClass: AlertClass.INCORRECT_CLASS
            });
          }
        }
      })
    }
  }

  cancelFunction() {
    this.hideModal()
  }

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
}
