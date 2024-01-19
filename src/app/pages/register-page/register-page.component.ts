import {Component, OnInit, ViewChild} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  FormControlStatus,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmButtonComponent } from '../../buttons/confirm-button/confirm-button.component';
import { InputFieldFormComponent } from '../../input-fields/input-field-form-big/input-field-form.component';
import { InputFieldFormSmallComponent } from '../../input-fields/input-field-form-small/input-field-form-small.component';
import {ErrorMessageComponent} from "../../error-messages/error-message/error-message.component";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ErrorMessageManualComponent} from "../../error-messages/error-message-manual/error-message-manual.component";
import {environment} from "../../../environment/environment";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NavigationService} from "../../services/navigation.service";
import {NavbarMinimalComponent} from "../../navigation/simple-navbar/navbar-minimal/navbar-minimal.component";
import {PermissionService} from "../../services/permission.service";
import {ValidationUtils} from "../../helpers/validation-utils";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmButtonComponent, InputFieldFormComponent, CommonModule, FontAwesomeModule, InputFieldFormSmallComponent, ErrorMessageComponent, RouterLink, RouterLinkActive, ErrorMessageManualComponent, TranslateModule, NavbarMinimalComponent, NavbarMinimalComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
  public registerForm!: FormGroup;

  showPassword: boolean = false;
  showSecondPassword: boolean = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash
  @ViewChild('registerErrorMessage', {static: false}) registerErrorMessage!: ErrorMessageManualComponent;

  constructor(private authenticationService: AuthenticationService, private translate: TranslateService, private sidebarService: NavigationService, private permissionService: PermissionService, private router: Router) { sidebarService.hideNavigation()}

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.required, Validators.email])),
      password: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required,  ValidationUtils.containsUppercase, ValidationUtils.containsLowercase, ValidationUtils.containsNumber, ValidationUtils.containsSpecialChar])),
      secondPassword: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required])),
      fullName: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(4), Validators.required, ValidationUtils.containsSpace ])),
    }, { validators: ValidationUtils.passwordsMatchValidator });
  }

  togglePasswordVisibilty(): void {
    this.showPassword = !this.showPassword;
  }
  toggleSecondPasswordVisitbilty(): void {
    this.showSecondPassword = !this.showSecondPassword
  }


  public onSubmit() {
    if (this.registerForm.valid) {
      this.authenticationService.register(
        this.registerForm.get('email')!.value,
        this.registerForm.get('password')!.value,
        this.registerForm.get('fullName')!.value
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
