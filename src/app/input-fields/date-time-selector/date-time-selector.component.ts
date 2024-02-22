import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {ErrorSetting} from "../default-input-field/default-input-field.component";

/**
 * Component for selecting a date and time.
 */
@Component({
  selector: 'app-date-time-selector',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    SingleErrorMessageComponent
  ],
  templateUrl: './date-time-selector.component.html',
  styleUrl: './date-time-selector.component.css'
})
export class DateTimeSelectorComponent {
  @Input() labelText = "";
  @Input() inputID = "";
  @Input() _formControl!: FormControl;
  @Input() hideErrorsWhenEmpty: boolean = false;
  @Input() errorSettings: ErrorSetting[] = [];
  @Input() minDate: string | null = "";
}
