import {Component} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgForOf, NgIf} from "@angular/common";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UpdateButtonComponent} from "../../../../SharedModule/components/buttons/update-button/update-button.component";
import {SliderComponent} from "../../../../SharedModule/components/input-fields/toggle-slider/slider.component";
import {
  DefaultInputFieldComponent
} from "../../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";
import {ErrorMessageComponent} from "../../../../SharedModule/components/error-message/error-message.component";
import {
  DefaultTextAreaComponent
} from "../../../../SharedModule/components/input-fields/default-text-area/default-text-area.component";
import {Association} from "../../../../CoreModule/models/association.model";
import {AssociationStatistics} from "../../../../CoreModule/models/association-statistics.model";
import {NavigationService} from "../../../../CoreModule/services/navigation.service";
import {GraphQLCommunication} from "../../../../CoreModule/services/graphql-communication.service";
import {AlertService} from "../../../../CoreModule/services/alert.service";
import {ActivatedRoute} from "@angular/router";
import {DefaultBooleanResponseDTO} from "../../../../CoreModule/models/dto/default-boolean-response-dto";
import {AlertClass, AlertIcon} from "../../../../SharedModule/components/alerts/alert-info/alert-info.component";


@Component({
  selector: 'app-settings-page',
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
    DefaultTextAreaComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})

export class SettingsPageComponent {
  faPencil = faPencil


  associationDetails: Association | undefined;
  associationStatistics: AssociationStatistics | undefined;
  protected updateAssociationDataForm: FormGroup<{
    associationName: FormControl<string | null>;
    email: FormControl<string | null>
    associationDescription: FormControl<string | null>
  }>;
  private associationID: string;



  constructor(
    private navigationService: NavigationService,
    private translate: TranslateService,
    private graphQL: GraphQLCommunication,
    private alertService: AlertService,
    route: ActivatedRoute
  ) {
    this.associationID = route.snapshot.params['associationID'];
    navigationService.showNavigation();
    this.translate.get('associationSettingsPage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.updateAssociationDataForm = new FormGroup({
      email: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.required, Validators.email])),
      associationName: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(4), Validators.required])),
      associationDescription: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(4), Validators.required])),
    });
    this.reloadData();
  }

  reloadData() {
    this.graphQL.getAssociationSettings(this.associationID).subscribe({
      next: (response) => {
        this.associationDetails = response.data.getAssociationDetails;
        this.setValuesInControls()
        }
    })

    this.graphQL.getAssociationStatistics(this.associationID).subscribe({
      next: (response) => {
        this.associationStatistics = response.data.getAssociationStatistics;
      }
    })
  }

  setValuesInControls() {
    this.updateAssociationDataForm.controls.associationName.setValue(this.associationDetails?.name + "")
    this.updateAssociationDataForm.controls.email.setValue(this.associationDetails?.contactEmail + "")
    this.updateAssociationDataForm.controls.associationDescription.setValue(this.associationDetails?.welcomeMessage + "")

  }


  handleChangeAssociationProfilePicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageURL = e.target?.result as string;
        this.graphQL.updateAssociationPicture(this.associationID, imageURL).subscribe({
          next: (response) => {
            const rDTO: DefaultBooleanResponseDTO = response.data.updateAssociationPicture
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
            console.log(response);
          },
          error: (e) => {
            console.log(e)
          }
        });
        this.associationDetails!.image!.encoded = imageURL;
      };
      reader.readAsDataURL(input.files[0])
    }
  }

  protected readonly document = document;


  resetSettingsForm() {
    this.setValuesInControls()
    this.alertService.showAlert({
      title: "Informatie",
      subTitle: "De wijzigingen zijn niet opgeslagen.",
      icon: AlertIcon.INFO,
      duration: 4000,
      alertClass: AlertClass.INFO_CLASS
    });
  }

  updateSettings() {
    if (!this.updateAssociationDataForm.controls.email.valid)
      return;
    if (!this.updateAssociationDataForm.controls.associationName.valid)
      return;
    if (!this.updateAssociationDataForm.controls.associationDescription.valid)
      return;

    this.graphQL.updateAssociationSettings(
      this.updateAssociationDataForm.controls.associationName.value!,
      this.updateAssociationDataForm.controls.associationDescription.value!,
      this.updateAssociationDataForm.controls.email.value!,
      this.associationID
    ).subscribe({
      next: (response) => {
        console.log(response)
        const rDTO = response.data.updateAssociationSettings as DefaultBooleanResponseDTO
        if(rDTO.success) {
          this.reloadData()
          this.alertService.showAlert({
            title: "Succesvol",
            subTitle: "De instellingen zijn succesvol bijgewerkt.",
            icon: AlertIcon.CHECK,
            duration: 4000,
            alertClass: AlertClass.CORRECT_CLASS
          });
        } else {
          this.alertService.showAlert({
            title: "Fout opgetreden",
            subTitle: "Er is een fout opgetreden bij het bijwerken van de instellingen.",
            icon: AlertIcon.XMARK,
            duration: 4000,
            alertClass: AlertClass.INCORRECT_CLASS
          });
        }
      },
      error: (e) => {
        this.alertService.showAlert({
          title: "Fout opgetreden",
          subTitle: "Er is een fout opgetreden bij het bijwerken van de instellingen.",
          icon: AlertIcon.XMARK,
          duration: 4000,
          alertClass: AlertClass.INCORRECT_CLASS
        });
      }
    })


  }
}
