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




  shouldShowError() : boolean  {
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
