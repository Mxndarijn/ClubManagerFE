import {Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-textarea-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './textarea-modal.component.html',
  styleUrl: './textarea-modal.component.css'
})
export class TextareaModalComponent {
  @Input() placeholder: string = '';
  @Input() textAreaID: string = '';
  @Input() labelText: string = '';
  @Input() _formControl!: FormControl ;
}
