import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgSwitch, NgSwitchCase} from "@angular/common";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {Modal, ModalChange, ModalService, ModalStatus} from "../../../../CoreModule/services/modal.service";
import {
  DefaultInputFieldComponent,
  InputFieldWidth
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {DefaultModalInformation} from "../../../../SharedModule/models/default-modal-information";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {TranslateModule} from "@ngx-translate/core";
import {
  SingleErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/single-error-message/single-error-message.component";
import {
  ErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/error-message/error-message.component";
import {AuthenticationService} from "../../../../CoreModule/services/authentication.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";


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
export class EmailVerificationModalComponent extends DefaultModalInformation {

  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  showEmailErrorMessage: boolean = false;
  resetMailForm: FormGroup<{
    email: FormControl<string | null>
  }> = new FormGroup({
    email: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.required, Validators.email]))
  });
  private intervalId?: ReturnType<typeof setInterval>;
  showPassword = false;
  profileEmail: string = ""


  constructor(
    private modalService: ModalService,
    private graphQL: GraphQLCommunication,
    private alertService: AlertService,
    private auth: AuthenticationService,
    private router: Router,
  ) {
    super(Modal.EMAIL_VERIFICATION, modalService);
    this.formControl = new FormControl("", Validators.compose([Validators.required, Validators.email]));
    this.modalService.modalVisibilityEvent.subscribe({
      next: (modalChange: ModalChange) => {
        if(modalChange.modal === Modal.EMAIL_VERIFICATION) {
          if(modalChange.status === ModalStatus.OPEN) {
            this.showEmailErrorMessage = false
            this.formControl.reset();
            this.intervalId = setInterval(() => {
              this.auth.isLoggedIn().then(result => {
                if (!result) {
                  this.router.navigate(['/login']);
                }
              })
              this.auth.isAccountVerified().then(result => {
                if (result) {
                  this.router.navigate(['/home']);
                }
              })
            }, 5000);
          } else {
            if(this.intervalId) {
              clearInterval(this.intervalId);
            }
          }
        }
    }
    })
  }

  changeEmail() {
    if (this.resetMailForm.valid) {
      const emailValue = this.resetMailForm.controls.email.value!;
      this.graphQL.changeEmailWhileInVerificationProcess(emailValue).then(res => {
        console.log(res)
        if (res.success) {
          this.auth.setToken(res.message);
          this.refreshProfileEmail()
        }
      })
      // Voeg hier je logica toe voor het wijzigen van de email
    }
  }

  refreshProfileEmail() {
    this.graphQL.getMyProfileEmail().then(result => {
      this.profileEmail = result.email;
    })
  }

  formControl: FormControl<String | null>;


  cancelFunction() {
    this.hideModal()
  }

  protected readonly InputFieldWidth = InputFieldWidth;
}
