import {Component, Input} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";

export enum InputFieldWidth {
  DEFAULT = 'w-96',
  FULL = 'w-full',
  HALF = 'w-6/12',
}

@Component({
  selector: 'app-default-input-field',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SingleErrorMessageComponent,
    NgForOf,
    FaIconComponent,
    NgIf,
    NgStyle,
    NgClass
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
  @Input() type: string = 'text';
  @Input() inputId: string = '';
  @Input() labelText: string = '';
  @Input() autocomplete: string = '';
  @Input() _formControl!: FormControl ;
  @Input() errorSettings: ErrorSetting[] = [];
  @Input() visibilityCanBeToggled = false;
  @Input() hideErrorsWhenEmpty: boolean = false;
  @Input() inputFieldWidth: InputFieldWidth = InputFieldWidth.DEFAULT
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
  protected showPassword: boolean = false;


  constructor() {
    if(this.inputId.length == 0) {
      this.inputId = Math.random().toString(36);
    }
  }
}

export interface ErrorSetting {
  errorMessage: string,
  errorName: string,
}
