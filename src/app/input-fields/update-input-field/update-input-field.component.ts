import {Component, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule} from "@angular/forms";

@Component({
  selector: 'app-update-input-field',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './update-input-field.component.html',
  styleUrl: './update-input-field.component.css'
})

export class UpdateInputFieldComponent implements ControlValueAccessor {
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
  @Input() inputId: string = '';
  @Input() labelText: string = '';
  protected readonly JSON = JSON;
  @Input() autocomplete: string = '';
}
