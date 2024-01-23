import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-calander-switch-button',
  standalone: true,
  imports: [],
  templateUrl: './calander-switch-button.component.html',
  styleUrl: './calander-switch-button.component.css'
})
export class CalanderSwitchButtonComponent {
@Input() label: string = '';
}
