import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../../CoreModule/services/authentication.service';
import {ConfirmButtonComponent} from '../../buttons/confirm-button/confirm-button.component';
import {ErrorMessageComponent} from "../../error-messages/error-message/error-message.component";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ErrorMessageManualComponent} from "../../error-messages/error-message-manual/error-message-manual.component";
import {environment} from "../../../environment/environment";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NavigationService} from "../../CoreModule/services/navigation.service";
import {NavbarMinimalComponent} from "../../navigation/simple-navbar/navbar-minimal/navbar-minimal.component";
import {PermissionService} from "../../CoreModule/services/permission.service";
import {ValidationUtils} from "../../utilities/validation-utils";
import {DefaultInputFieldComponent} from "../../input-fields/default-input-field/default-input-field.component";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmButtonComponent, CommonModule, FontAwesomeModule,  ErrorMessageComponent, RouterLink, RouterLinkActive, ErrorMessageManualComponent, TranslateModule, NavbarMinimalComponent, NavbarMinimalComponent, DefaultInputFieldComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  protected registerForm: FormGroup<{
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    fullName: FormControl<string | null>;
    email: FormControl<string | null>
  }>;


  @ViewChild('registerErrorMessage', {static: false}) registerErrorMessage!: ErrorMessageManualComponent;

  constructor(private authenticationService: AuthenticationService, private translate: TranslateService, private sidebarService: NavigationService, private permissionService: PermissionService, private router: Router) {
    sidebarService.hideNavigation()
    this.registerForm = new FormGroup({
      email: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.required, Validators.email])),
      password: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required,  ValidationUtils.containsUppercase, ValidationUtils.containsLowercase, ValidationUtils.containsNumber, ValidationUtils.containsSpecialChar])),
      confirmPassword: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required])),
      fullName: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(4), Validators.required, ValidationUtils.containsSpace ])),
    }, { validators: ValidationUtils.passwordsMatchValidator });
  }




  public onSubmit() {
    if (this.registerForm.valid) {
      this.authenticationService.register(
        this.registerForm.controls.email.value!,
        this.registerForm.controls.password.value!,
        this.registerForm.controls.fullName.value!
      ).subscribe({
        next: (registerRequest) => {
        if(!registerRequest.success) {
          if (typeof registerRequest.error === 'string') {
            this.translate.get('registerPage.errors.serverResponses.' + registerRequest.error).subscribe((res: string) => {
                this.registerErrorMessage.showErrorMessage(res);
              }
            )
          } else {
            this.translate.get('registerPage.errors.serverResponses.otherError').subscribe((res: string) => {
                this.registerErrorMessage.showErrorMessage(res);
              }
            )
          }
        } else {
          this.registerErrorMessage.hideErrorMessage();
          this.permissionService.refreshPermissions();
          this.sidebarService.refreshNavigation();
          this.router.navigate(['/home']);
        }
      }
      })
    }
  }

  protected readonly environment = environment;
}
