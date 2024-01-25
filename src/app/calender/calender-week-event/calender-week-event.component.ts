import {Component, Input} from '@angular/core';
import {CalendarEvent} from "angular-calendar";
import {CalenderEvent} from "../calender-view/calender-view.component";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-calender-week-event',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './calender-week-event.component.html',
  styleUrl: './calender-week-event.component.css'
})
export class CalenderWeekEventComponent {
@Input() calendarEvent: CalenderEvent | undefined
}
