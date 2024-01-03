import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmButtonComponent } from '../buttons/confirm-button/confirm-button.component';
import { InputFieldFormComponent } from '../input-fields/input-field-form-big/input-field-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ErrorMessageComponent} from "../error-messages/error-message/error-message.component";
import {ErrorMessageManualComponent} from "../error-messages/error-message-manual/error-message-manual.component";
import {environment} from "../../environment/environment";





@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [ReactiveFormsModule, ConfirmButtonComponent, InputFieldFormComponent, CommonModule, FontAwesomeModule, RouterLink, RouterLinkActive, ErrorMessageComponent, ErrorMessageManualComponent],
})
export class LoginPageComponent implements OnInit {
  public loginForm!: FormGroup;

  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  @ViewChild('loginErrorMessage', {static: false}) loginErrorMessage!: ErrorMessageManualComponent;

  constructor(private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.email, Validators.required])),
      password: new FormControl('', Validators.required),
    });
  }

  togglePasswordVisibilty(): void {
    this.showPassword = !this.showPassword;
  }

  public onSubmit() {
    if(this.loginForm.valid) {
      this.authenticationService.login(
        this.loginForm.get('email')!.value,
        this.loginForm!.get('password')!.value
      ).subscribe({
        next: (loginRequest) => {
          if(!loginRequest.success) {
            if (typeof loginRequest.error === 'string') {
              switch (loginRequest.error) {
                case "account-validation-error":
                  this.loginErrorMessage.showErrorMessage("Er is een fout opgetreden tijdens het valideren van de gegevens.");
                  break;
                case "account-bad-credentials":
                  this.loginErrorMessage.showErrorMessage("Email en wachtwoord komen niet overeen.");
                  break;
              }
            } else {
              this.loginErrorMessage.showErrorMessage("Er is een fout opgetreden.")
            }
          } else {
            this.loginErrorMessage.hideErrorMessage();
            // navigate to home
          }
        },
        error: (e) => {
          this.loginErrorMessage.showErrorMessage("Er is een fout opgetreden tijdens het inloggen.");
        }
      })
    }
  }

  protected readonly environment = environment;
}
