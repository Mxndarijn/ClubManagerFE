import {Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  // constructor(errorMessage: string, controlName: string, formGroup: FormGroup) {
  //   this.errorMessage = errorMessage;
  //   this.controlName = controlName;
  //   this.formGroup = formGroup;
  // }
  protected readonly JSON = JSON;
}
