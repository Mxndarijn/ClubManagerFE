import {Component} from '@angular/core';
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {UpdateButtonComponent} from "../../../../SharedModule/components/buttons/update-button/update-button.component";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {User} from "../../../../CoreModule/models/user.model";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ValidationUtils} from "../../../../SharedModule/utilities/validation-utils";
import {
  ErrorMessageComponent
} from "../../../../SharedModule/components/error-messages/error-message/error-message.component";
import {SliderComponent} from "../../../../SharedModule/components/input-fields/toggle-slider/slider.component";
import {
  DefaultInputFieldComponent, InputFieldWidth
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {TabComponent} from "../../../../SharedModule/components/tab/tab.component";
import {TabDataSource} from "../../../../SharedModule/components/tab/tab-datasource";
import {
  ButtonClass,
  ButtonSize,
  CustomButton
} from "../../../../SharedModule/components/buttons/custom-button/custom-button";
import {
  SecurityCodeModalComponent
} from "../../../AssociationModule/modals/security-code-modal/security-code-modal.component";
import {Modal, ModalService} from "../../../../CoreModule/services/modal.service";


enum Tab {
  MY_CONTACTDATA,
  SECURITY,
  PREFERENCES
}

enum InputFieldTitle {
  CHANGE_PASSWORD = 'Verander wachtwoord',
  CHANG_EMAIL = 'Verander email'
}

@Component({
  selector: 'app-update-profile-page',
  standalone: true,
  imports: [
    NgForOf,
    UpdateButtonComponent,
    SliderComponent,
    DefaultInputFieldComponent,
    FaIconComponent,
    ReactiveFormsModule,
    TranslateModule,
    ErrorMessageComponent,
    NgIf,
    TabComponent,
    CustomButton,
    SecurityCodeModalComponent
  ],
  templateUrl: './update-profile-page.component.html',
  styleUrl: './update-profile-page.component.css'
})
export class UpdateProfilePageComponent {
  faPencil = faPencil
  showPassword: boolean = false;
  protected readonly InputFieldWidth = InputFieldWidth;
  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
  protected readonly Tab = Tab;
  protected readonly document = document;
  protected readonly InputFieldTitle = InputFieldTitle;
  protected readonly Modal = Modal;
  protected currentEmail: string = "";

  activeTitleMessage = InputFieldTitle.CHANGE_PASSWORD;

  profile: User | undefined;
  protected passwordFormGroup: FormGroup<{
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;

  protected myContactDataFormGroup: FormGroup<{
    fullName: FormControl<string | null>;
    license: FormControl<string | null>;
  }>;
  emailFormControl: FormControl;
  activeTab: Tab = Tab.MY_CONTACTDATA;

  tabDataSource: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Mijn gegevens",
        onClick: () => {
          this.activeTab = Tab.MY_CONTACTDATA
        }
      },
      {
        label: "Beveiliging",
        onClick: () => {
          this.activeTab = Tab.SECURITY
        }
      },
      {
        label: "Voorkeuren",
        onClick: () => {
          this.activeTab = Tab.PREFERENCES
        }
      }
    ]
  };

  constructor(
    private navigationService: NavigationService,
    private translate: TranslateService,
    private graphQL: GraphQLCommunication,
    private alertService: AlertService,
    protected modalService: ModalService,
  ) {
    navigationService.showNavigation();
    this.translate.get('profilePage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.myContactDataFormGroup = new FormGroup({
      fullName: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(4), Validators.required, ValidationUtils.containsSpace])),
      license: new FormControl<string>('', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.required]))
    })

    this.passwordFormGroup = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.maxLength(255),
        Validators.minLength(8),
        ValidationUtils.containsUppercase,
        ValidationUtils.containsLowercase,
        ValidationUtils.containsNumber,
        ValidationUtils.containsSpecialChar
      ])),
      confirmPassword: new FormControl<string>('', Validators.compose([
        Validators.maxLength(255), Validators.minLength(8)])),
    }, {validators: ValidationUtils.passwordsMatchValidator});
    this.emailFormControl = new FormControl<string>('', Validators.compose([Validators.email, Validators.required]))

    this.reloadData();
  }

  reloadData() {
    this.graphQL.getMyFullProfile().then(p => {
      this.profile = p;
      this.emailFormControl.setValue(this.profile?.email + "");
      this.currentEmail = this.profile?.email + "";
      this.myContactDataFormGroup.controls.fullName.setValue(this.profile?.fullName + "");
      this.myContactDataFormGroup.controls.license.setValue(this.profile?.knsaMembershipNumber + "");
    })
  }


  handleChangeProfilePicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageURL = e.target?.result as string;
        this.graphQL.uploadProfilePicture(imageURL).then(rDTO => {
          if (rDTO.success) {
            this.navigationService.refreshNavigation();
            this.alertService.showPositiveAlert("De afbeelding is succesvol geupload.");
          } else {
            this.alertService.showNegativeAlert("Probeer het later opnieuw.")
          }

        }).catch(e => {
          console.log(e)
        });
        this.profile!.image!.encoded = imageURL;
      };
      reader.readAsDataURL(input.files[0])
    }
  }

  filterValue() {
    if (!this.myContactDataFormGroup || !this.myContactDataFormGroup.controls.license.value) {
      return;
    }
    const newValue = this.myContactDataFormGroup.controls.license.value.replace(/\D/g, "");
    if(newValue != this.myContactDataFormGroup.controls.license.value) {
      this.myContactDataFormGroup.controls.license.setValue(newValue);
    }
  }

  updateMyDataProfile() {
    if (!this.myContactDataFormGroup.valid)
      return;

    this.graphQL.updateMyDataProfile(
      this.myContactDataFormGroup.controls.fullName.value,
      this.myContactDataFormGroup.controls.license.value,
    ).then(rDTO => {
      if (rDTO.success) {
        this.reloadData();
        this.alertService.showPositiveAlert("De wijzigingen zijn succesvol opgeslagen.");
      } else {
        this.alertService.showNegativeAlert("Er is een fout opgetreden bij het bijwerken van uw profiel.")
      }
    }).catch(e => {
      this.alertService.showNegativeAlert("Er is een fout opgetreden bij het bijwerken van uw profiel.")
    });
  }


  updateProfilePassword(code: string) {
    if (!this.passwordFormGroup.valid)
      return;

    this.graphQL.resetPassword(
      code,
      this.passwordFormGroup.controls.password.value!).then(response => {
      if(response.success) {
        this.modalService.hideModal(Modal.SECURITY_CODE)
        this.alertService.showPositiveAlert( "Je wachtwoord is veranderd.");
      } else {
        if (response.message == "invalid-response-code") {
          this.alertService.showNegativeAlert("De code die je hebt opgegeven klopt niet.")
        } else {
          this.modalService.hideModal(Modal.SECURITY_CODE)
          this.alertService.showNegativeAlert("Er is een fout opgetreden.")
        }
      }
    })
  }

  updateProfileEmail(code: string) {
    if (!this.emailFormControl.valid)
      return;

    this.graphQL.resetEmail(
      code,
      this.emailFormControl.value!).then(response => {
      if(response.success) {
        this.modalService.hideModal(Modal.SECURITY_CODE);
        this.alertService.showPositiveAlert("Je email is veranderd.");
      } else {
        if (response.message == "invalid-response-code") {
          this.alertService.showNegativeAlert("De code die je hebt opgegeven klopt niet.");
        } else {
          this.modalService.hideModal(Modal.SECURITY_CODE)
          this.alertService.showNegativeAlert("Er is een fout opgetreden.");
        }
      }
    })
  }

  openSecurityModal(titleMessage: InputFieldTitle) {
    this.graphQL.requestSecurityCode(this.currentEmail).then(response => {
      if(!(response && response.success)) {
        this.alertService.showNegativeAlert("Kon geen verificatie code sturen.");
      }
    })
      this.activeTitleMessage = titleMessage;
    this.modalService.showModal(Modal.SECURITY_CODE)
  }

  securityCodeReceived(code:string) {
    switch (this.activeTitleMessage) {
      case InputFieldTitle.CHANGE_PASSWORD:
        this.updateProfilePassword(code);
        break;
      case InputFieldTitle.CHANG_EMAIL:
        this.updateProfileEmail(code);
        break;
    }
  }
}
