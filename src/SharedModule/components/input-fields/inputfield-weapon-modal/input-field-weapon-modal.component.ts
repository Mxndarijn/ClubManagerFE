import {Component, Input} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { ErrorSetting } from '../default-input-field/default-input-field.component';
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";

@Component({
  selector: 'app-inputfield-weapon-modal',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    SingleErrorMessageComponent
  ],
  templateUrl: './input-field-weapon-modal.component.html',
  styleUrl: './input-field-weapon-modal.component.css'
})
export class InputFieldWeaponModalComponent {
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


