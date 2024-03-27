import {Component, Input} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SingleErrorMessageComponent} from "../../../../app/SharedModule/components/error-messages/single-error-message/single-error-message.component";

@Component({
  selector: 'app-default-input-field',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SingleErrorMessageComponent,
    NgForOf,
    FaIconComponent,
    NgIf
  ],
  templateUrl: './default-input-field.component.html',
  styleUrl: './default-input-field.component.css'
})

export class DefaultInputFieldComponent {
  onTouch: any = () => {};


  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  @Input() placeholder: string = '';
  @Input() type: string = '';
  @Input() inputId: string = '';
  @Input() labelText: string = '';
  @Input() autocomplete: string = '';
  @Input() _formControl!: FormControl ;
  @Input() errorSettings: ErrorSetting[] = [];
  @Input() visibilityCanBeToggled = false;
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
  protected showPassword: boolean = false;
  @Input() hideErrorsWhenEmpty: boolean = false;
}

export interface ErrorSetting {
  errorMessage: string,
  errorName: string,
}
