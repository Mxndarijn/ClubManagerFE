import {Component, Input} from '@angular/core';
import {NavigationService} from "../../services/navigation.service";
import {TranslateService} from "@ngx-translate/core";
import {NgForOf} from "@angular/common";
import {UpdateButtonComponent} from "../../buttons/update-button/update-button.component";
import {SliderComponent} from "../../toggle-slider/slider.component";
import {InputFieldFormComponent} from "../../input-fields/input-field-form-big/input-field-form.component";
import {UpdateInputFieldComponent} from "../../input-fields/update-input-field/update-input-field.component";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GraphQLCommunication} from "../../services/graphql-communication.service";
import {User} from "../../../model/user.model";
import {DefaultBooleanResponseDTO} from "../../../model/dto/default-boolean-response-dto";
import {AlertClass, AlertIcon} from "../../alerts/alert-info/alert-info.component";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-update-profile-page',
  standalone: true,
  imports: [
    NgForOf,
    UpdateButtonComponent,
    SliderComponent,
    InputFieldFormComponent,
    UpdateInputFieldComponent,
    FaIconComponent
  ],
  templateUrl: './update-profile-page.component.html',
  styleUrl: './update-profile-page.component.css'
})
export class UpdateProfilePageComponent {
  faPencil = faPencil
  profile: User | undefined;


  constructor(
    private navigationService: NavigationService,
    private translate: TranslateService,
    private graphQL: GraphQLCommunication,
    private alertService : AlertService

  ) {
    navigationService.showNavigation();
    this.translate.get('profilePage.titleHeader').subscribe((res: string) => {
        navigationService.setTitle(res);
      }
    )
    this.graphQL.getMyProfile().subscribe({
      next: (data) => {
        this.profile = data.data.getMyProfile;
        console.log(this.profile);
      }
    })

  }

  handleChangeProfilePicture(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageURL = e.target?.result as string;
        this.graphQL.uploadProfilePicture(imageURL).subscribe({
          next: (response) => {
             const rDTO: DefaultBooleanResponseDTO = response.data.updateMyProfilePicture
            if(rDTO.success) {
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
        this.profile!.image!.encoded = imageURL;
      };
      reader.readAsDataURL(input.files[0])
    }
  }

  protected readonly document = document;
}
