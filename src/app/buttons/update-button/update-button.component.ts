import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-update-button',
  standalone: true,
  imports: [],
  templateUrl: './update-button.component.html',
  styleUrl: './update-button.component.css'
})
export class UpdateButtonComponent {
  @Input() label: string = '';
  @Input() borderClass: string = '';
  @Input() disabledCondition: boolean = false;
}
