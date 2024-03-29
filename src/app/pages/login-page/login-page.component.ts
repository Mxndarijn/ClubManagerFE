import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmButtonComponent } from '../../buttons/confirm-button/confirm-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ErrorMessageComponent} from "../../error-messages/error-message/error-message.component";
import {ErrorMessageManualComponent} from "../../error-messages/error-message-manual/error-message-manual.component";
import {environment} from "../../../environment/environment";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NavigationService} from "../../services/navigation.service";
import {PermissionService} from "../../services/permission.service";
import {NavbarMinimalComponent} from "../../navigation/simple-navbar/navbar-minimal/navbar-minimal.component";
import {DefaultInputFieldComponent} from "../../input-fields/default-input-field/default-input-field.component";





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
              private permissionService: PermissionService) {
    this.navigationService.hideNavigation();
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
      password: new FormControl('', Validators.required),
    });

  }

  public onSubmit() {
    if(this.loginForm.valid) {
      this.authenticationService.login(
        this.loginForm.controls.email.value!,
        this.loginForm.controls.password.value!,
      ).subscribe({
        next: (loginRequest) => {
          if(!loginRequest.success) {
            if (typeof loginRequest.error === 'string') {
              this.translate.get('loginPage.errors.serverResponses.' + loginRequest.error).subscribe((res: string) => {
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
