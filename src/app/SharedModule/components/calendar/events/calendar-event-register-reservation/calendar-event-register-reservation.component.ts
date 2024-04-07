import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CalendarEventData} from "../../models/CalendarEventData";
import {CalendarEvent} from "../../calender-view/calender-view.component";
import {UtilityFunctions} from "../../../../utilities/utility-functions";
import {NgStyle} from "@angular/common";
import {Reservation} from "../../../../../CoreModule/models/reservation.model";

@Component({
  selector: 'app-calendar-event-register-reservation',
  standalone: true,
  imports: [
    NgStyle
  ],
  templateUrl: './calendar-event-register-reservation.component.html',
  styleUrl: './calendar-event-register-reservation.component.css'
})
export class CalendarEventRegisterReservationComponent implements CalendarEventData, OnInit {
  @Input() data?: CalendarEvent;
  @Input() calendarItemClickedEvent?: EventEmitter<CalendarEvent>;

  protected reservation?: Reservation;

  startTime: string = "";

  async ngOnInit() {
    if(this.data) {
      this.reservation = this.data.data as Reservation;
      console.log(this.reservation)
    }
    this.startTime = await this.utility.formatTime(this.data?.startDate);
  }


  constructor(
    protected utility: UtilityFunctions
  ) {

  }

}
