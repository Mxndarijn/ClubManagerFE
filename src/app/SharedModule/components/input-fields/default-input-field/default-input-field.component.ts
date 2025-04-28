import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SingleErrorMessageComponent} from "../../error-messages/single-error-message/single-error-message.component";
import {Observable, Subscription} from "rxjs";

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

export class DefaultInputFieldComponent implements OnInit, OnDestroy {
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

  @Output() valueChanged = new EventEmitter<null>();
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
  protected showPassword: boolean = false;
  protected obser? : Subscription


  constructor() {
    if(this.inputId.length == 0) {
      this.inputId = Math.random().toString(36);
    }
  }

  ngOnDestroy(): void {
       this.obser?.unsubscribe()
    }

  ngOnInit(): void {
    this.obser = this._formControl.valueChanges.subscribe(e => {
      this.valueChanged.emit()
    })

    }
}

export interface ErrorSetting {
  errorMessage: string,
  errorName: string,
}
