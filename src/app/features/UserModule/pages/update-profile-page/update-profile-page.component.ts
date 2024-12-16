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


enum Tab {
  MY_CONTACTDATA,
  SECURITY,
  PREFERENCES
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
    CustomButton
  ],
  templateUrl: './update-profile-page.component.html',
  styleUrl: './update-profile-page.component.css'
})
export class UpdateProfilePageComponent {
  faPencil = faPencil
  showPassword: boolean = false;


  profile: User | undefined;
  protected securityFormGroup: FormGroup<{
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    email: FormControl<string | null>
  }>;


  protected myContactDataFormGroup: FormGroup<{
    fullName: FormControl<string | null>;
    license: FormControl<string | null>;
  }>;
  protected checkPasswordForm: FormControl;
  activeTab: Tab = Tab.MY_CONTACTDATA;

  protected readonly Tab = Tab;
  tabDataSource: TabDataSource = {
    defaultActive: 0,
    items: [
      {
        label: "Mijn gegevens",
        onClick : () => {
          this.activeTab = Tab.MY_CONTACTDATA
        }
      },
      {
        label: "Beveiliging",
        onClick : () => {
          this.activeTab = Tab.SECURITY
        }
      },
      {
        label: "Voorkeuren",
        onClick : () => {
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
  ) {
    navigationService.showNavigation();
    this.translate.get('profilePage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.myContactDataFormGroup = new FormGroup ({
      fullName: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(4), Validators.required, ValidationUtils.containsSpace])),
      license: new FormControl<string>('', Validators.compose([Validators.minLength(8), Validators.maxLength(8), Validators.required]))
    })

    this.securityFormGroup = new FormGroup({
      email: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([
        Validators.maxLength(255),
        Validators.minLength(8),
        ValidationUtils.containsUppercase,
        ValidationUtils.containsLowercase,
        ValidationUtils.containsNumber,
        ValidationUtils.containsSpecialChar
      ])),
      confirmPassword: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(8)])),
    }, {validators: ValidationUtils.passwordsMatchValidator});
    this.checkPasswordForm = new FormControl<string>('', Validators.required);
    this.reloadData();
  }

  reloadData() {
    this.graphQL.getMyFullProfile().then(p => {
        this.profile = p;
        this.securityFormGroup.controls.email.setValue(this.profile?.email + "");
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
              this.alertService.showAlert({
                title: "Succesvol",
                subTitle: "De afbeelding is succesvol geupload.",
                icon: AlertIcon.CHECK,
                duration: 4000,
                alertClass: AlertClass.CORRECT_CLASS
              });
            } else {
              this.alertService.showAlert({
                title: "Fout opgetreden",
                subTitle: "Probeer het later opnieuw.",
                icon: AlertIcon.XMARK,
                duration: 4000,
                alertClass: AlertClass.INCORRECT_CLASS
              });
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
    if(!this.myContactDataFormGroup || !this.myContactDataFormGroup.controls.license.value) {
      return ""
    }
    return this.myContactDataFormGroup.controls.license.value.replace(/\D/g, "");
  }


  protected readonly document = document;

  // updateProfile() {
  //   if (!this.checkPasswordForm.valid)
  //     return;
  //   if (!this.updateDataForm.controls.email.valid)
  //     return;
  //   if (!this.updateDataForm.controls.fullName.valid)
  //     return;
  //   if (this.updateDataForm.errors?.["passwordsMismatch"] != null)
  //     return;
  //
  //   this.graphQL.updateProfile(
  //     this.updateDataForm.controls.fullName.value,
  //     this.updateDataForm.controls.email.value,
  //     this.updateDataForm.controls.password.value,
  //     this.checkPasswordForm.value
  //   ).then(rDTO => {
  //       if (rDTO.success) {
  //         this.reloadData();
  //         this.alertService.showAlert({
  //           title: "Succesvol",
  //           subTitle: "De wijzigingen zijn succesvol opgeslagen.",
  //           icon: AlertIcon.CHECK,
  //           duration: 4000,
  //           alertClass: AlertClass.CORRECT_CLASS
  //         });
  //       } else {
  //         switch (rDTO.message) {
  //           case "not-correct-password": {
  //             this.alertService.showAlert({
  //               title: "Fout opgetreden",
  //               subTitle: "Het ingevoerde wachtwoord komt niet overeen.",
  //               icon: AlertIcon.XMARK,
  //               duration: 4000,
  //               alertClass: AlertClass.INCORRECT_CLASS
  //             });
  //             break;
  //           }
  //           default: {
  //             this.alertService.showAlert({
  //               title: "Fout opgetreden",
  //               subTitle: "Er is een fout opgetreden bij het bijwerken van uw profiel.",
  //               icon: AlertIcon.XMARK,
  //               duration: 4000,
  //               alertClass: AlertClass.INCORRECT_CLASS
  //             });
  //             break;
  //           }
  //
  //         }
  //       }
  //   }).catch(e => {
  //     this.alertService.showAlert({
  //       title: "Fout opgetreden",
  //       subTitle: "Er is een fout opgetreden bij het bijwerken van uw profiel.",
  //       icon: AlertIcon.XMARK,
  //       duration: 4000,
  //       alertClass: AlertClass.INCORRECT_CLASS
  //     });
  //   });
  // }
  //
  // resetUpdateForm() {
  //   // this.updateDataForm.reset()
  //   this.updateDataForm.controls.email.setValue(this.profile?.email + "")
  //   this.updateDataForm.controls.fullName.setValue(this.profile?.fullName + "")
  //   this.updateDataForm.controls.password.setValue("")
  //   this.updateDataForm.controls.confirmPassword.setValue("")
  //
  //   this.alertService.showAlert({
  //     title: "Informatie",
  //     subTitle: "De wijzigingen zijn niet opgeslagen.",
  //     icon: AlertIcon.INFO,
  //     duration: 4000,
  //     alertClass: AlertClass.INFO_CLASS
  //   });
  // }

  protected readonly InputFieldWidth = InputFieldWidth;
  protected readonly ButtonClass = ButtonClass;
  protected readonly ButtonSize = ButtonSize;
}
