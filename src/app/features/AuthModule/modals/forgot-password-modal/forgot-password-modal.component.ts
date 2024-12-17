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

enum Step {
  STEP_1,
  STEP_2,
}

@Component({
  selector: 'app-forgot-password-modal',
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
  templateUrl: './forgot-password-modal.html',
  styleUrl: './forgot-password-modal.css'
})
export class ForgotPasswordModalComponent extends DefaultModalInformation implements OnInit {

  protected step: Step = Step.STEP_1;
  protected readonly Step = Step;
  protected steps = [
    {
      step: Step.STEP_1,
      label: "Wachtwoord vergeten"
    },
    {
      step: Step.STEP_2,
      label: "Nieuw wachtwoord"
    }
  ]
  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  showEmailErrorMessage: boolean = false;

  getClassForStep(currentStep: Step) {
    if (currentStep <= this.step) {
      return "step-accent";
    }
    return "";
  }


  constructor(
    modalService: ModalService,
    private graphQL: GraphQLCommunication,
    private alertService: AlertService
  ) {
    super(Modal.FORGOT_PASSWORD, modalService);
    this.formControl = new FormControl("", Validators.compose([Validators.required, Validators.email]));
    this.resetPasswordFormGroup = new FormGroup({
      password: new FormControl<string>("", Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required, ValidationUtils.containsUppercase, ValidationUtils.containsLowercase, ValidationUtils.containsNumber, ValidationUtils.containsSpecialChar])),
      confirmPassword: new FormControl<string>("", Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required])),
      code: new FormControl<string>("", Validators.compose([Validators.minLength(8), Validators.maxLength(8)])),
    }, {validators: ValidationUtils.passwordsMatchValidator});
  }

  ngOnInit(): void {
    this.showEmailErrorMessage = false
    this.formControl.reset();
    this.resetPasswordFormGroup.reset()
    this.resetPasswordFormGroup.controls.password.setValue("")
    this.resetPasswordFormGroup.controls.confirmPassword.setValue("")
  }

  formControl: FormControl<string | null>;
  resetPasswordFormGroup: FormGroup<{
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    code: FormControl<string | null>;

  }>

  acceptFunction() {
    if (this.formControl.valid) {
      this.showEmailErrorMessage = false
      this.graphQL.requestSecurityCode(this.formControl.value!).then(response => {
        console.log(response)
        if (!response) {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
          this.hideModal();
        }
        if (response.success) {
          this.step = Step.STEP_2;
        } else {
          if (response.message == "no-user-found") {
            this.showEmailErrorMessage = true
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

  protected readonly console = console;

  filterValue() {
    if(!this.formControl || !this.formControl.value) {
      return ""
    }
    return this.formControl.value.replace(/\D/g, "");
  }

  reduceStep() {
    this.step--
  }

  resetPasswordFunction() {
    if(!this.resetPasswordFormGroup.valid) {
      return
    }
    this.graphQL.resetPassword(this.resetPasswordFormGroup.controls.code.value!, this.resetPasswordFormGroup.controls.password.value!).then(response => {
      if(response.success) {
        this.hideModal()
        this.alertService.showAlert({
          title: "Succesvol",
          subTitle: "Je wachtwoord is veranderd.",
          icon: AlertIcon.CHECK,
          duration: 4000,
          alertClass: AlertClass.CORRECT_CLASS
        });
      } else {
        if(response.message == "invalid-response-code") {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "De code die je hebt opgegeven klopt niet.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });

        } else {
          this.hideModal()
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

  protected readonly InputFieldWidth = InputFieldWidth;
}
