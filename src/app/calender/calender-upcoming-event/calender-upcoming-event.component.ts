import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CalendarEvent} from "angular-calendar";
import {CalenderEvent} from "../calender-view/calender-view.component";
import {UtilityFunctions} from "../../utilities/utility-functions";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-calender-upcoming-event',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './calender-upcoming-event.component.html',
  styleUrl: './calender-upcoming-event.component.css'
})
export class CalenderUpcomingEventComponent implements OnInit {
  @Input() calendarEvent!: CalenderEvent
  @Input() index!: number
  @Input() calendarItemClickedEvent? : EventEmitter<CalenderEvent>

  protected time: string = ""

  constructor(
    private utility: UtilityFunctions
  ) {
  }

  ngOnInit(): void {
    this.utility.formatDateTime(this.calendarEvent.startDate).then(result => {
      this.time = result;
    })

  }

}
