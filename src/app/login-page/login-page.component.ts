import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmButtonComponent } from '../buttons/confirm-button/confirm-button.component';
import { InputFieldFormComponent } from '../input-fields/input-field-form-big/input-field-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';





@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [ReactiveFormsModule, ConfirmButtonComponent, InputFieldFormComponent, CommonModule, FontAwesomeModule],
})
export class LoginPageComponent implements OnInit {
  public loginForm!: FormGroup;

  showPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
    });
  }

  togglePasswordVisibilty(): void {
    this.showPassword = !this.showPassword;
  }

  public onSubmit() {
    this.authenticationService.login(
      this.loginForm.get('email')!.value,
      this.loginForm!.get('password')!.value
    );
  }
}