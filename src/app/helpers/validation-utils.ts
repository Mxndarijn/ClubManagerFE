import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ValidationUtils {

  static containsUppercase(control: FormControl): ValidationErrors | null {
    const uppercasePattern = /[A-Z]/;
    return uppercasePattern.test(control.value) ? null : { 'noUppercase': true };
  }

  static containsSpace(control: FormControl): ValidationErrors | null {
    const spacePattern = /\s/;
    return spacePattern.test(control.value) ? null : { 'noSpace': true };
  }

  static passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (confirmPassword.length === 0 || password.length === 0) {
      return null;
    }
    return password === confirmPassword ? null : { 'passwordsMismatch': true };
  };

  static containsLowercase(control: FormControl): ValidationErrors | null {
    const lowercasePattern = /[a-z]/;
    return lowercasePattern.test(control.value) ? null : { 'noLowercase': true };
  }

  static containsNumber(control: FormControl): ValidationErrors | null {
    const numberPattern = /\d/;
    return numberPattern.test(control.value) ? null : { 'noNumber': true };
  }

  static containsSpecialChar(control: FormControl): ValidationErrors | null {
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialCharPattern.test(control.value) ? null : { 'noSpecialChar': true };
  }
}
