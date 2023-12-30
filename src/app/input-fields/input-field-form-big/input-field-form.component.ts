import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-field-form',
  standalone: true,
  imports: [],
  templateUrl: './input-field-form.component.html',
  styleUrl: './input-field-form.component.css'
})
export class InputFieldFormComponent {
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = '';
}
