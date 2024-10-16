import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormControl, FormGroup,} from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent {
  @Input() errorMessage!: string;
  @Input() controlName!: string;
  @Input() formGroup!: FormGroup;
  @Input() specificError: string = '';




  /**
   * Determines whether an error should be shown for a form control.
   * @returns {boolean} true if an error should be shown, false otherwise.
   */
  shouldShowError() : boolean  {
    if(this.controlName == null) {
      if(this.specificError.length > 0) {
        return this.formGroup.errors?.[this.specificError] != null;
      }
      return !this.formGroup.valid;
    }
    let formControl = this.formGroup.controls[this.controlName];
    if(formControl == null || formControl.valid) {
      return false;
    }
    if(!formControl.touched) {
      return false;
    }

    if(this.specificError.length > 0) {
      return formControl.errors?.[this.specificError] != null;
    }

    return true;
  }

  protected readonly JSON = JSON;
}
