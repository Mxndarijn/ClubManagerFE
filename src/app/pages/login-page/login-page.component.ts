import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../../CoreModule/services/authentication.service';
import {ConfirmButtonComponent} from '../../SharedModule/components/buttons/confirm-button/confirm-button.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {
  ErrorMessageComponent
} from "../../SharedModule/components/error-messages/error-message/error-message.component";
import {
  ErrorMessageManualComponent
} from "../../SharedModule/components/error-messages/error-message-manual/error-message-manual.component";
import {environment} from "../../../environment/environment";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NavigationService} from "../../CoreModule/services/navigation.service";
import {PermissionService} from "../../CoreModule/services/permission.service";
import {
  NavbarMinimalComponent
} from "../../SharedModule/components/navigation/simple-navbar/navbar-minimal/navbar-minimal.component";
import {GraphQLCommunication} from "../../CoreModule/services/graphql-communication.service";
import {
  DefaultInputFieldComponent
} from "../../../SharedModule/components/input-fields/default-input-field/default-input-field.component";


@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [ReactiveFormsModule, ConfirmButtonComponent, CommonModule, FontAwesomeModule, RouterLink, RouterLinkActive, ErrorMessageComponent, ErrorMessageManualComponent, TranslateModule, NavbarMinimalComponent, NavbarMinimalComponent, DefaultInputFieldComponent],
})
export class LoginPageComponent {
  public loginForm: FormGroup<{
    password: FormControl<string | null>;
    email: FormControl<string | null>
  }>;

  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  @ViewChild('loginErrorMessage', {static: false}) loginErrorMessage!: ErrorMessageManualComponent;
  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private translate: TranslateService,
              private navigationService: NavigationService,
              private graphQLCommunication: GraphQLCommunication,
              private permissionService: PermissionService) {
    this.navigationService.hideNavigation();
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
      password: new FormControl('', Validators.required),
    });

  }

  public onSubmit() {
    if(this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.controls.email.value!, this.loginForm.controls.password.value!).subscribe({
        next: (dto) => {
          if(!dto.success) {
            if (typeof dto.message === 'string') {
              this.translate.get('loginPage.errors.serverResponses.' + dto.message).subscribe((res: string) => {
                  this.loginErrorMessage.showErrorMessage(res);
                }
              )
            } else {
              this.translate.get('loginPage.errors.serverResponses.otherError').subscribe((res: string) => {
                  this.loginErrorMessage.showErrorMessage(res);
                }
              )
            }
          } else {
            this.loginErrorMessage.hideErrorMessage();
            this.permissionService.refreshPermissions();
            this.navigationService.refreshNavigation();
            this.router.navigate(['/home']);
            // navigate to home

          }
        },
        error: (e) => {
          this.translate.get('loginPage.errors.serverResponses.errorDuringLogin').subscribe((res: string) => {
              this.loginErrorMessage.showErrorMessage(res);
            }
          )
        }
      })
    }
  }

  protected readonly environment = environment;
}
