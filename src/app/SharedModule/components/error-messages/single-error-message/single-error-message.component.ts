import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-single-error-message',
  templateUrl: './single-error-message.component.html',
  styleUrls: ['./single-error-message.component.css'],
  imports: [
    NgIf
  ],
  standalone: true
})
export class SingleErrorMessageComponent {
  @Input() errorMessage!: string;
  @Input() specificFormControl!: FormControl;
  @Input() specificError: string = '';

  shouldShowError(): boolean {

    if (!this.specificFormControl || this.specificFormControl.valid) {
      return false;
    }
    if (!this.specificFormControl.touched) {
      return false;
    }

    if (this.specificError.length > 0) {
      return this.specificFormControl.errors?.[this.specificError] != null;
    }

    return true;
  }
}
