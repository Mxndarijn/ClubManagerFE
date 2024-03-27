import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-default-text-area',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './default-text-area.component.html',
  styleUrl: './default-text-area.component.css'
})
export class DefaultTextAreaComponent {
  @Input() placeholder: string = '';
  @Input() textAreaID: string = '';
  @Input() labelText: string = '';
  @Input() _formControl!: FormControl ;

}
