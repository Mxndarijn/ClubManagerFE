import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field-form-small',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-field-form-small.component.html',
  styleUrl: './input-field-form-small.component.css'
})
export class InputFieldFormSmallComponent {
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = '';
}
