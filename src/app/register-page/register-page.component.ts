import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors, FormControlStatus } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmButtonComponent } from '../buttons/confirm-button/confirm-button.component';
import { InputFieldFormComponent } from '../input-fields/input-field-form-big/input-field-form.component';
import { InputFieldFormSmallComponent } from '../input-fields/input-field-form-small/input-field-form-small.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmButtonComponent, InputFieldFormComponent, CommonModule, FontAwesomeModule, InputFieldFormSmallComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
  public registerForm!: FormGroup;

  showPassword: boolean = false;
  showSecondPassword: boolean = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.required, Validators.email])),
      password: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required])),
      secondPassword: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(8), Validators.required])),
      firstName: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(2), Validators.required])),
      lastName: new FormControl<string>('', Validators.compose([Validators.maxLength(255), Validators.minLength(2), Validators.required]))
    });
  }

  togglePasswordVisibilty(): void {
    this.showPassword = !this.showPassword;
  }
  toggleSecondPasswordVisitbilty(): void {
    this.showSecondPassword = !this.showSecondPassword
  }

  containsUppercase(control: FormControl): ValidationErrors | null {
    const uppercasePattern = /[A-Z]/;
    return uppercasePattern.test(control.value) ? null : { 'noUppercase': true };
  }


  containsLowercase(control: FormControl): ValidationErrors | null {
    const lowercasePattern = /[a-z]/;
    return lowercasePattern.test(control.value) ? null : { 'noLowercase': true };
  }


  containsNumber(control: FormControl): ValidationErrors | null {
    const numberPattern = /\d/;
    return numberPattern.test(control.value) ? null : { 'noNumber': true };
  }


  containsSpecialChar(control: FormControl): ValidationErrors | null {
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialCharPattern.test(control.value) ? null : { 'noSpecialChar': true };
  }


  public onSubmit() {
    console.log(this.registerForm.get('firstName')!.value);

    console.log(this.registerForm.status)
    if (this.registerForm.valid) {
      if (this.registerForm.get('password')!.value === this.registerForm.get('secondPassword')!.value) {
        this.authenticationService.register(
          this.registerForm.get('email')!.value,
          this.registerForm.get('password')!.value,
          this.registerForm.get('firstName')!.value,
          this.registerForm.get('lastName')!.value
        )
        alert("test")
      } else {
        alert("howdy")
        console.log("First: ", this.registerForm.get('password'), "Second: ", this.registerForm.get('secondPassword'))
      }
    }
  }
}
