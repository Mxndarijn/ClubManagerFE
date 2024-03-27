import {Component, EventEmitter, Input} from '@angular/core';
import {CalendarView} from "angular-calendar";

@Component({
  selector: 'app-calander-switch-button',
  standalone: true,
  imports: [],
  templateUrl: './calander-switch-button.component.html',
  styleUrl: './calander-switch-button.component.css'
})
export class CalanderSwitchButtonComponent {
@Input() label: string = '';
@Input() viewChangeEvent!: EventEmitter<CalendarView>;
@Input() view!: CalendarView;
}
