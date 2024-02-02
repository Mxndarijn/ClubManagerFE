import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ValidationUtils {

  static containsUppercase(control: AbstractControl): ValidationErrors | null {
    const uppercasePattern = /[A-Z]/;
    return uppercasePattern.test(control.value) ? null : { 'noUppercase': true };
  }

  static containsSpace(control: AbstractControl): ValidationErrors | null {
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

  static validateDates: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    return ValidationUtils.isDateAfterOther(group.get("maintenanceStartDate")?.value, group.get("maintenanceEndDate")?.value);
  };

  static containsLowercase(control: AbstractControl): ValidationErrors | null {
    const lowercasePattern = /[a-z]/;
    return lowercasePattern.test(control.value) ? null : { 'noLowercase': true };
  }

  static containsNumber(control: AbstractControl): ValidationErrors | null {
    const numberPattern = /\d/;
    return numberPattern.test(control.value) ? null : { 'noNumber': true };
  }

  static containsSpecialChar(control: AbstractControl): ValidationErrors | null {
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return specialCharPattern.test(control.value) ? null : { 'noSpecialChar': true };
  }

  static isDatePresentOrFuture(control: AbstractControl): ValidationErrors | null {
    const d = new Date(control.value);
    return d.getTime() >= Date.now() ? null : { 'dateNotPresentOrFuture': true };
  }

  static isDateAfterOther(dateString1: string, dateString2: string) {
    if(dateString1 == null || dateString2 == null)
      return null;
    const d = new Date(dateString1);
    const d1 = new Date(dateString2);
    return d.getTime() < d1.getTime()? null : { 'dateNotAfterOther': true };
  }
}
