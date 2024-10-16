import {CalendarEvent} from "../calender-view/calender-view.component";
import {EventEmitter} from "@angular/core";

export interface CalendarEventData {
  data?: CalendarEvent;
  calendarItemClickedEvent?: EventEmitter<CalendarEvent>

}
