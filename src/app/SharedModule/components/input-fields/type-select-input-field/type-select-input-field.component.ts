import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-type-select-input-field',
  standalone: true,
  imports: [],
  templateUrl: './type-select-input-field.component.html',
  styleUrl: './type-select-input-field.component.css'
})
export class TypeSelectInputFieldComponent {
  @Input() _formControl!: FormControl ;

}
