import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {CalendarEventData} from "../../models/CalendarEventData";
import {CalendarEvent} from "../../calender-view/calender-view.component";
import {UtilityFunctions} from "../../../../utilities/utility-functions";
import {NgIf, NgStyle} from "@angular/common";
import {Reservation} from "../../../../../CoreModule/models/reservation.model";
import {CalendarUtility} from "../../calendar-utils";

@Component({
  selector: 'app-calendar-event-register-reservation',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
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
    }
    this.startTime = await this.utility.formatTime(this.data?.startDate);
  }


  constructor(
    protected utility: UtilityFunctions
  ) {

  }

  isEnoughSpace() {
    if(!this.data)
      return false
    const startRow = CalendarUtility.getCorrectRow(this.data.startDate)
    const endRow = CalendarUtility.getCorrectRow(this.data.endDate)
    // console.log("DATA")
    // console.log((endRow - startRow))
    return (endRow - startRow > 10)
  }
}
