import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-input-field-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './input-field-form.component.html',
  styleUrl: './input-field-form.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldFormComponent),
      multi: true
    }
  ]
})
export class InputFieldFormComponent implements ControlValueAccessor {
  private _value: any;
  onChange: any = () => {};
  onTouch: any = () => {};

  get value(): any {
    return this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  updateValue(val: any): void {
    this.value = val;
  }

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  @Input() placeholder: string = '';
  @Input() type: string = '';
}
