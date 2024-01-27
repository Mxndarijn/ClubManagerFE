import {Component, EventEmitter, Output} from '@angular/core';
import {CalanderSwitchButtonComponent} from "../../buttons/calander-switch-button/calander-switch-button.component";
import {CalendarView} from "../calender-view/calender-view.component";

@Component({
  selector: 'app-calender-switch-button',
  standalone: true,
  imports: [
    CalanderSwitchButtonComponent
  ],
  templateUrl: './calender-switch.component.html',
  styleUrl: './calender-switch.component.css'
})
export class CalenderSwitchComponent {
  @Output() public viewChangeEvent = new EventEmitter<CalendarView>();

  protected readonly CalendarView = CalendarView;
}
