import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-default-checkbox-input-field',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './default-checkbox-input-field.component.html',
  styleUrl: './default-checkbox-input-field.component.css'
})
export class DefaultCheckboxInputFieldComponent {
  @Input() _class: string = "toggle";
  @Input() labelText: string = "";
  @Input() _formControl!: FormControl;
  _type: string = "checkbox";

}
