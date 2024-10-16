import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CalendarEventData} from "../../models/CalendarEventData";
import {CalendarEvent} from '../../calender-view/calender-view.component';
import {UtilityFunctions} from "../../../../utilities/utility-functions";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-calendar-event-common',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './calendar-event-common.component.html',
  styleUrl: './calendar-event-common.component.css'
})
export class CalendarEventCommonComponent implements CalendarEventData, OnInit {
    @Input() data?: CalendarEvent;
    @Input() calendarItemClickedEvent?: EventEmitter<CalendarEvent>;

  startTime: string = "";

  async ngOnInit() {
    this.startTime = await this.utility.formatTime(this.data?.startDate);
  }


  constructor(
    protected utility: UtilityFunctions
  ) {

  }

}
